# Advanced PostgreSQL Analysis Queries

Use these when the user wants to go beyond the standard exploration stages.
Copy and adapt these into a Python script or run via `psql`.

---

## 1. Missing Indexes on Foreign Key Columns

Foreign key columns without indexes can cause slow JOIN and DELETE operations.

```sql
SELECT
    tc.table_schema,
    tc.table_name,
    kcu.column_name AS fk_column,
    tc.constraint_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
   AND tc.table_schema = kcu.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND NOT EXISTS (
      SELECT 1
      FROM pg_index pi
      JOIN pg_class pc ON pc.oid = pi.indrelid
      JOIN pg_namespace pn ON pn.oid = pc.relnamespace
      JOIN pg_attribute pa ON pa.attrelid = pc.oid
          AND pa.attnum = ANY(pi.indkey)
      WHERE pn.nspname = tc.table_schema
        AND pc.relname = tc.table_name
        AND pa.attname = kcu.column_name
  )
ORDER BY tc.table_schema, tc.table_name;
```

---

## 2. Tables with No Primary Key

```sql
SELECT t.table_schema, t.table_name
FROM information_schema.tables t
WHERE t.table_type = 'BASE TABLE'
  AND t.table_schema NOT IN ('pg_catalog', 'information_schema')
  AND NOT EXISTS (
      SELECT 1
      FROM information_schema.table_constraints tc
      WHERE tc.table_schema = t.table_schema
        AND tc.table_name = t.table_name
        AND tc.constraint_type = 'PRIMARY KEY'
  )
ORDER BY t.table_schema, t.table_name;
```

---

## 3. Enum Types

```sql
SELECT
    n.nspname AS schema,
    t.typname AS enum_name,
    array_agg(e.enumlabel ORDER BY e.enumsortorder) AS values
FROM pg_type t
JOIN pg_namespace n ON n.oid = t.typnamespace
JOIN pg_enum e ON e.enumtypid = t.oid
WHERE n.nspname NOT IN ('pg_catalog', 'information_schema')
GROUP BY n.nspname, t.typname
ORDER BY n.nspname, t.typname;
```

---

## 4. Custom Domain Types

```sql
SELECT
    domain_schema,
    domain_name,
    data_type,
    character_maximum_length,
    domain_default
FROM information_schema.domains
WHERE domain_schema NOT IN ('pg_catalog', 'information_schema')
ORDER BY domain_schema, domain_name;
```

---

## 5. Circular Foreign Key Detection

```sql
WITH RECURSIVE fk_chain AS (
    SELECT
        tc.table_schema AS child_schema,
        tc.table_name AS child_table,
        ccu.table_schema AS parent_schema,
        ccu.table_name AS parent_table,
        ARRAY[tc.table_schema || '.' || tc.table_name] AS path,
        false AS cycle
    FROM information_schema.table_constraints tc
    JOIN information_schema.referential_constraints rc
        ON tc.constraint_name = rc.constraint_name
    JOIN information_schema.constraint_column_usage ccu
        ON rc.unique_constraint_name = ccu.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY'

    UNION ALL

    SELECT
        fk.child_schema,
        fk.child_table,
        r.parent_schema,
        r.parent_table,
        fk.path || (r.child_schema || '.' || r.child_table),
        r.child_schema || '.' || r.child_table = ANY(fk.path)
    FROM fk_chain fk
    JOIN (
        SELECT
            tc.table_schema AS child_schema,
            tc.table_name AS child_table,
            ccu.table_schema AS parent_schema,
            ccu.table_name AS parent_table
        FROM information_schema.table_constraints tc
        JOIN information_schema.referential_constraints rc
            ON tc.constraint_name = rc.constraint_name
        JOIN information_schema.constraint_column_usage ccu
            ON rc.unique_constraint_name = ccu.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
    ) r ON fk.parent_schema = r.child_schema AND fk.parent_table = r.child_table
    WHERE NOT fk.cycle
)
SELECT DISTINCT path
FROM fk_chain
WHERE cycle = true;
```

---

## 6. Largest Tables by Total Size

```sql
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname || '.' || tablename)) AS total_size,
    pg_size_pretty(pg_relation_size(schemaname || '.' || tablename)) AS table_size,
    pg_size_pretty(
        pg_total_relation_size(schemaname || '.' || tablename) -
        pg_relation_size(schemaname || '.' || tablename)
    ) AS index_size
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY pg_total_relation_size(schemaname || '.' || tablename) DESC
LIMIT 20;
```

---

## 7. Column Usage Across Tables (find shared column names)

```sql
SELECT
    column_name,
    data_type,
    array_agg(table_schema || '.' || table_name ORDER BY table_schema, table_name) AS tables
FROM information_schema.columns
WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
GROUP BY column_name, data_type
HAVING COUNT(*) > 1
ORDER BY COUNT(*) DESC, column_name;
```

---

## 8. View Definitions

```sql
SELECT
    table_schema AS schema,
    table_name AS view_name,
    view_definition
FROM information_schema.views
WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
ORDER BY table_schema, table_name;
```

---

## 9. Materialized Views

```sql
SELECT
    schemaname AS schema,
    matviewname AS view_name,
    hasindexes,
    ispopulated,
    definition
FROM pg_matviews
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY schemaname, matviewname;
```

---

## 10. Triggers

```sql
SELECT
    trigger_schema,
    trigger_name,
    event_manipulation,
    event_object_table,
    action_timing,
    action_statement
FROM information_schema.triggers
WHERE trigger_schema NOT IN ('pg_catalog', 'information_schema')
ORDER BY event_object_table, trigger_name;
```
