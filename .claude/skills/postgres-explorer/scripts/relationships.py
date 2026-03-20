#!/usr/bin/env python3
"""Stage 4: Discover foreign key relationships between tables."""

import sys
from collections import defaultdict

def main():
    if len(sys.argv) < 2:
        print("Usage: relationships.py <connection_string> [schema_name]")
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

        schema_clause = "AND tc.table_schema = %s" if schema_filter else ""
        params = (schema_filter,) if schema_filter else ()

        cur.execute(f"""
            SELECT
                tc.table_schema AS child_schema,
                tc.table_name AS child_table,
                kcu.column_name AS child_column,
                ccu.table_schema AS parent_schema,
                ccu.table_name AS parent_table,
                ccu.column_name AS parent_column,
                tc.constraint_name,
                rc.update_rule,
                rc.delete_rule
            FROM information_schema.table_constraints tc
            JOIN information_schema.key_column_usage kcu
                ON tc.constraint_name = kcu.constraint_name
               AND tc.table_schema = kcu.table_schema
            JOIN information_schema.referential_constraints rc
                ON tc.constraint_name = rc.constraint_name
               AND tc.constraint_schema = rc.constraint_schema
            JOIN information_schema.constraint_column_usage ccu
                ON rc.unique_constraint_name = ccu.constraint_name
               AND rc.unique_constraint_schema = ccu.constraint_schema
            WHERE tc.constraint_type = 'FOREIGN KEY'
              AND tc.table_schema NOT IN ('pg_catalog', 'information_schema')
              {schema_clause}
            ORDER BY tc.table_schema, tc.table_name, kcu.column_name;
        """, params)

        rows = cur.fetchall()

        if not rows:
            print("No foreign key relationships found.")
            cur.close()
            conn.close()
            return

        print("=" * 70)
        print("FOREIGN KEY RELATIONSHIPS")
        print("=" * 70)
        print()

        # Group by child table
        by_child = defaultdict(list)
        for row in rows:
            child_schema, child_table, child_col, parent_schema, parent_table, parent_col, constraint, on_update, on_delete = row
            child_key = f"{child_schema}.{child_table}"
            by_child[child_key].append(row)

        for child_key, fks in sorted(by_child.items()):
            print(f"  {child_key}")
            for row in fks:
                _, _, child_col, parent_schema, parent_table, parent_col, constraint, on_update, on_delete = row
                parent_key = f"{parent_schema}.{parent_table}"
                rules = []
                if on_update and on_update != 'NO ACTION':
                    rules.append(f"ON UPDATE {on_update}")
                if on_delete and on_delete != 'NO ACTION':
                    rules.append(f"ON DELETE {on_delete}")
                rule_str = f"  [{', '.join(rules)}]" if rules else ""
                print(f"    .{child_col}  →  {parent_key}.{parent_col}{rule_str}")
            print()

        # Adjacency list for ER mapping
        print("=" * 70)
        print("ADJACENCY LIST (for ER diagram)")
        print("=" * 70)
        edges = set()
        for row in rows:
            child_schema, child_table, _, parent_schema, parent_table, _, _, _, _ = row
            child_key = f"{child_schema}.{child_table}"
            parent_key = f"{parent_schema}.{parent_table}"
            edges.add((parent_key, child_key))

        for parent, child in sorted(edges):
            print(f"  {parent}  →  {child}")

        # Tables with no outbound FKs (likely root/leaf entities)
        all_tables_q = """
            SELECT table_schema || '.' || table_name
            FROM information_schema.tables
            WHERE table_type = 'BASE TABLE'
              AND table_schema NOT IN ('pg_catalog', 'information_schema')
              AND table_schema NOT LIKE 'pg_%%'
        """
        if schema_filter:
            all_tables_q += " AND table_schema = %s"
        cur.execute(all_tables_q, params)
        all_tables = {row[0] for row in cur.fetchall()}

        child_tables = {f"{r[0]}.{r[1]}" for r in rows}
        parent_tables = {f"{r[3]}.{r[4]}" for r in rows}
        root_tables = all_tables - child_tables
        isolated_tables = all_tables - child_tables - parent_tables

        print()
        print("SUMMARY:")
        print(f"  Total tables          : {len(all_tables)}")
        print(f"  Tables with FK (child): {len(child_tables)}")
        print(f"  Referenced (parent)   : {len(parent_tables)}")
        print(f"  Root entities (no FK) : {len(root_tables)}")
        if isolated_tables:
            print(f"  Isolated (no FKs)     : {len(isolated_tables)}")
            for t in sorted(isolated_tables):
                print(f"    - {t}")

        cur.close()
        conn.close()

    except Exception as e:
        print(f"ERROR: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
