#!/usr/bin/env python3
"""Stage 1: Connect and get a top-level overview of the PostgreSQL database."""

import sys
import re

def mask_password(conn_str: str) -> str:
    return re.sub(r'(:)[^:@]+(@)', r'\1****\2', conn_str)

def main():
    if len(sys.argv) < 2:
        print("Usage: overview.py <connection_string>")
        sys.exit(1)

    conn_str = sys.argv[1]

    try:
        import psycopg2
    except ImportError:
        print("psycopg2 not installed. Run: pip install psycopg2-binary --break-system-packages")
        sys.exit(1)

    try:
        conn = psycopg2.connect(conn_str)
        cur = conn.cursor()

        # Version
        cur.execute("SELECT version();")
        version = cur.fetchone()[0]

        # Current DB name
        cur.execute("SELECT current_database();")
        dbname = cur.fetchone()[0]

        # DB size
        cur.execute("SELECT pg_size_pretty(pg_database_size(current_database()));")
        db_size = cur.fetchone()[0]

        # Schemas (non-system)
        cur.execute("""
            SELECT schema_name
            FROM information_schema.schemata
            WHERE schema_name NOT IN ('pg_catalog', 'information_schema')
              AND schema_name NOT LIKE 'pg_%'
            ORDER BY schema_name;
        """)
        schemas = [row[0] for row in cur.fetchall()]

        # Table counts per schema
        schema_table_counts = {}
        for schema in schemas:
            cur.execute("""
                SELECT COUNT(*)
                FROM information_schema.tables
                WHERE table_schema = %s
                  AND table_type = 'BASE TABLE';
            """, (schema,))
            schema_table_counts[schema] = cur.fetchone()[0]

        # Total tables
        total_tables = sum(schema_table_counts.values())

        print("=" * 60)
        print("DATABASE OVERVIEW")
        print("=" * 60)
        print(f"Database     : {dbname}")
        print(f"Size         : {db_size}")
        print(f"Version      : {version.split(',')[0]}")
        print(f"Total Tables : {total_tables}")
        print()
        print("SCHEMAS:")
        for schema, count in schema_table_counts.items():
            print(f"  {schema:<30} {count} table(s)")

        cur.close()
        conn.close()

    except Exception as e:
        print(f"ERROR: {e}")
        print(f"Connection attempted with: {mask_password(conn_str)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
