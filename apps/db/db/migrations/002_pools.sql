-- ============================================================
-- 002_pools.sql  —  Saved Pools schema
-- Idempotent: safe to run multiple times (IF NOT EXISTS throughout)
-- ============================================================

DO $$ BEGIN
    CREATE TYPE draft_mode_enum AS ENUM ('mvp', 'franchise', 'custom');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE pool_visibility_enum AS ENUM ('public', 'private');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS pools (
    id          UUID                 PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT                 NOT NULL,
    draft_mode  draft_mode_enum      NOT NULL,
    visibility  pool_visibility_enum NOT NULL,
    entries     JSONB                NOT NULL,
    created_by  TEXT,
    created_at  TIMESTAMPTZ          NOT NULL DEFAULT now()
);
