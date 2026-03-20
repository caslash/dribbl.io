#!/usr/bin/env python3
"""Stage 3: Describe a table's columns, primary keys, indexes, and constraints."""

import sys

def main():
    if len(sys.argv) < 3:
        print("Usage: describe_table.py <connection_string> <schema.table>")
        print("  Example: describe_table.py 'postgresql://...' public.users")
        sys.exit(1)

    conn_str = sys.argv[1]
    table_ref = sys.argv[2]

    if '.' in table_ref:
        schema_name, table_name = table_ref.split('.', 1)
    else:
        schema_name = 'public'
        table_name = table_ref

    try:
        import psycopg2
    except ImportError:
        print("psycopg2 not installed. Run: pip install psycopg2-binary --break-system-packages")
        sys.exit(1)

    try:
        conn = psycopg2.connect(conn_str)
        cur = conn.cursor()

        # Columns
        cur.execute("""
            SELECT
                c.column_name,
                c.data_type,
                c.character_maximum_length,
                c.numeric_precision,
                c.numeric_scale,
                c.is_nullable,
                c.column_default,
                pgd.description AS column_comment
            FROM information_schema.columns c
            LEFT JOIN pg_catalog.pg_statio_all_tables st
                ON st.schemaname = c.table_schema
               AND st.relname = c.table_name
            LEFT JOIN pg_catalog.pg_description pgd
                ON pgd.objoid = st.relid
               AND pgd.objsubid = c.ordinal_position
            WHERE c.table_schema = %s
              AND c.table_name = %s
            ORDER BY c.ordinal_position;
        """, (schema_name, table_name))
        columns = cur.fetchall()

        if not columns:
            print(f"Table '{schema_name}.{table_name}' not found or has no columns.")
            sys.exit(1)

        # Primary key columns
        cur.execute("""
            SELECT kcu.column_name
            FROM information_schema.table_constraints tc
            JOIN information_schema.key_column_usage kcu
                ON tc.constraint_name = kcu.constraint_name
               AND tc.table_schema = kcu.table_schema
            WHERE tc.constraint_type = 'PRIMARY KEY'
              AND tc.table_schema = %s
              AND tc.table_name = %s
            ORDER BY kcu.ordinal_position;
        """, (schema_name, table_name))
        pk_cols = {row[0] for row in cur.fetchall()}

        # Indexes
        cur.execute("""
            SELECT
                i.relname AS index_name,
                ix.indisunique AS is_unique,
                ix.indisprimary AS is_primary,
                array_agg(a.attname ORDER BY unnest(ix.indkey)) AS columns
            FROM pg_index ix
            JOIN pg_class t ON t.oid = ix.indrelid
            JOIN pg_class i ON i.oid = ix.indexrelid
            JOIN pg_namespace n ON n.oid = t.relnamespace
            JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = ANY(ix.indkey)
            WHERE n.nspname = %s
              AND t.relname = %s
              AND a.attnum > 0
            GROUP BY i.relname, ix.indisunique, ix.indisprimary
            ORDER BY ix.indisprimary DESC, i.relname;
        """, (schema_name, table_name))
        indexes = cur.fetchall()

        # Check constraints
        cur.execute("""
            SELECT
                cc.constraint_name,
                cc.check_clause
            FROM information_schema.check_constraints cc
            JOIN information_schema.table_constraints tc
                ON cc.constraint_name = tc.constraint_name
               AND cc.constraint_schema = tc.constraint_schema
            WHERE tc.table_schema = %s
              AND tc.table_name = %s
              AND cc.check_clause NOT LIKE '%IS NOT NULL%';
        """, (schema_name, table_name))
        checks = cur.fetchall()

        # Table comment
        cur.execute("""
            SELECT obj_description(
                (quote_ident(%s) || '.' || quote_ident(%s))::regclass,
                'pg_class'
            );
        """, (schema_name, table_name))
        table_comment = cur.fetchone()[0]

        # --- Output ---
        print("=" * 70)
        print(f"TABLE: {schema_name}.{table_name}")
        if table_comment:
            print(f"COMMENT: {table_comment}")
        print("=" * 70)

        print("\nCOLUMNS:")
        print(f"  {'Column':<25} {'Type':<25} {'Nullable':<10} {'Default':<20} PK")
        print(f"  {'-'*25} {'-'*25} {'-'*10} {'-'*20} --")

        for col in columns:
            col_name, data_type, char_max, num_prec, num_scale, nullable, default, comment = col

            # Format type
            if char_max:
                type_str = f"{data_type}({char_max})"
            elif num_prec and data_type in ('numeric', 'decimal'):
                type_str = f"{data_type}({num_prec},{num_scale or 0})"
            else:
                type_str = data_type

            is_pk = "✓" if col_name in pk_cols else ""
            default_str = (default or "")[:20] if default else ""
            nullable_str = "YES" if nullable == "YES" else "NO"
            comment_str = f"  -- {comment}" if comment else ""

            print(f"  {col_name:<25} {type_str:<25} {nullable_str:<10} {default_str:<20} {is_pk}{comment_str}")

        if indexes:
            print("\nINDEXES:")
            for idx_name, is_unique, is_primary, idx_cols in indexes:
                flags = []
                if is_primary:
                    flags.append("PRIMARY KEY")
                if is_unique and not is_primary:
                    flags.append("UNIQUE")
                flag_str = f" [{', '.join(flags)}]" if flags else ""
                cols_str = ", ".join(idx_cols)
                print(f"  {idx_name}: ({cols_str}){flag_str}")

        if checks:
            print("\nCHECK CONSTRAINTS:")
            for name, clause in checks:
                print(f"  {name}: {clause}")

        cur.close()
        conn.close()

    except Exception as e:
        print(f"ERROR: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
