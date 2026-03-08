#!/usr/bin/env python3
"""Stage 2: List tables in a schema with row estimates and sizes."""

import sys

def main():
    if len(sys.argv) < 2:
        print("Usage: list_tables.py <connection_string> [schema_name]")
        sys.exit(1)

    conn_str = sys.argv[1]
    schema_filter = sys.argv[2] if len(sys.argv) > 2 else None

    try:
        import psycopg2
    except ImportError:
        print("psycopg2 not installed. Run: pip install psycopg2-binary --break-system-packages")
        sys.exit(1)

    try:
        conn = psycopg2.connect(conn_str)
        cur = conn.cursor()

        schema_clause = "AND t.table_schema = %s" if schema_filter else ""
        params = (schema_filter,) if schema_filter else ()

        query = f"""
            SELECT
                t.table_schema,
                t.table_name,
                pg_size_pretty(pg_total_relation_size(
                    quote_ident(t.table_schema) || '.' || quote_ident(t.table_name)
                )) AS total_size,
                COALESCE(s.n_live_tup, 0) AS estimated_rows,
                obj_description(
                    (quote_ident(t.table_schema) || '.' || quote_ident(t.table_name))::regclass,
                    'pg_class'
                ) AS table_comment
            FROM information_schema.tables t
            LEFT JOIN pg_stat_user_tables s
                ON s.schemaname = t.table_schema
               AND s.relname = t.table_name
            WHERE t.table_type = 'BASE TABLE'
              AND t.table_schema NOT IN ('pg_catalog', 'information_schema')
              AND t.table_schema NOT LIKE 'pg_%'
              {schema_clause}
            ORDER BY t.table_schema, t.table_name;
        """

        cur.execute(query, params)
        rows = cur.fetchall()

        if not rows:
            print("No tables found.")
            cur.close()
            conn.close()
            return

        current_schema = None
        for schema, table, size, rows_est, comment in rows:
            if schema != current_schema:
                print()
                print(f"Schema: {schema}")
                print("-" * 60)
                print(f"  {'Table':<35} {'Est. Rows':>12} {'Size':>10}")
                print(f"  {'-'*35} {'-'*12} {'-'*10}")
                current_schema = schema

            comment_str = f"  -- {comment}" if comment else ""
            print(f"  {table:<35} {rows_est:>12,} {size:>10}{comment_str}")

        print()
        print(f"Total: {len(rows)} table(s)")

        cur.close()
        conn.close()

    except Exception as e:
        print(f"ERROR: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
