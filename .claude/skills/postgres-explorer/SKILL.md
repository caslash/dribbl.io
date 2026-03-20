---
name: postgres-explorer
description: Explore and understand a PostgreSQL database from a connection string. Use this skill whenever the user provides a PostgreSQL connection string and wants to explore the database, understand its structure, inspect table schemas, discover relationships between tables, analyze foreign keys, view indexes, or get a high-level map of the database. Trigger for any request involving database exploration, schema discovery, ER diagram generation, or understanding how tables relate. Use even for partial requests like "what tables are in this DB", "show me the schema", "how are these tables related", or "explore this postgres database".
---

# PostgreSQL Database Explorer

This skill enables structured exploration of a PostgreSQL database — from listing schemas and tables, to understanding columns, relationships, indexes, and constraints.

## Setup

Install `psycopg2` if not already available:

```bash
pip install psycopg2-binary --break-system-packages --quiet
```

The user will supply a connection string in one of these formats:
- `postgresql://user:password@host:port/dbname`
- `postgres://user:password@host:port/dbname`
- Standard libpq keyword/value: `host=... dbname=... user=... password=...`

**Always confirm you have a connection string before proceeding.**

---

## Exploration Workflow

Work through these stages progressively. Start broad, then drill down based on what the user wants.

### Stage 1 — Connect & Orient

Run the connection test + top-level overview script:

```bash
python /home/claude/postgres-explorer/scripts/overview.py "<CONNECTION_STRING>"
```

This outputs:
- PostgreSQL version
- Database name
- List of non-system schemas (excluding `pg_*`, `information_schema`)
- Total table count per schema
- Database size

### Stage 2 — List Tables

```bash
python /home/claude/postgres-explorer/scripts/list_tables.py "<CONNECTION_STRING>" [schema_name]
```

Omit `schema_name` to list all schemas. Output includes table name, row count estimate, and size on disk.

### Stage 3 — Inspect Table Schema

```bash
python /home/claude/postgres-explorer/scripts/describe_table.py "<CONNECTION_STRING>" <schema.table>
```

Output includes:
- Column names, data types, nullability, defaults
- Primary key columns
- Indexes (name, columns, uniqueness)
- Check constraints
- Comments on columns (if present)

### Stage 4 — Discover Relationships

```bash
python /home/claude/postgres-explorer/scripts/relationships.py "<CONNECTION_STRING>" [schema_name]
```

Output includes:
- All foreign key constraints within the schema
- Parent table → child table direction
- Referencing and referenced columns
- A plain-text adjacency list for ER mapping

### Stage 5 — Deep Schema Analysis (optional)

For deeper understanding, read `references/advanced-queries.md` for queries covering:
- Identifying orphaned records
- Finding missing indexes on FK columns
- Detecting circular FK references
- Enumerating enums and custom types
- Spotting tables with no PK

---

## Presenting Results

After running the scripts, synthesize findings for the user:

1. **Overview paragraph**: What kind of database is this? How many schemas/tables? Rough purpose if apparent from naming.
2. **Schema map**: Group tables by schema, note row counts.
3. **Relationship summary**: Describe clusters of related tables (e.g., "users → orders → order_items form the core transactional graph").
4. **Notable observations**: Missing indexes on FK columns, tables with no PK, large tables, unusual types.

If the user wants an ER diagram, describe the entity relationships in a Mermaid `erDiagram` block.

---

## Error Handling

| Error | Likely Cause | Suggestion |
|---|---|---|
| `connection refused` | Wrong host/port or DB not running | Verify host, port, firewall |
| `authentication failed` | Wrong user/password | Double-check credentials |
| `database does not exist` | Wrong dbname | List DBs with `\l` in psql |
| `SSL required` | Server requires SSL | Append `?sslmode=require` to URL |
| `timeout` | Network/firewall issue | Check VPN, security groups |

---

## Security Note

Never log or echo the full connection string in output. Mask passwords in any printed messages.
