-- ============================================================
-- 001_initial.sql  —  NBA Pipeline schema
-- Idempotent: safe to run multiple times (IF NOT EXISTS throughout)
-- ============================================================

-- ----------------------------------------------------------
-- Enum types
-- ----------------------------------------------------------

DO $$ BEGIN
    CREATE TYPE season_type_enum AS ENUM ('Regular Season', 'Playoffs');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE scrape_status_enum AS ENUM ('pending', 'complete', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


-- ----------------------------------------------------------
-- teams
-- Seeded from nba_api.stats.static.teams before any player scraping.
-- ----------------------------------------------------------

CREATE TABLE IF NOT EXISTS teams (
    team_id      BIGINT       PRIMARY KEY,
    abbreviation VARCHAR(10)  NOT NULL,
    nickname     TEXT         NOT NULL,   -- "Lakers"
    city         TEXT         NOT NULL,
    state        TEXT,
    full_name    TEXT         NOT NULL,
    year_founded SMALLINT
);


-- ----------------------------------------------------------
-- players
-- One row per NBA player (historical + active).
-- Sourced from CommonPlayerInfo.
-- ----------------------------------------------------------

CREATE TABLE IF NOT EXISTS players (
    player_id        BIGINT      PRIMARY KEY,
    first_name       TEXT        NOT NULL,
    last_name        TEXT        NOT NULL,
    full_name        TEXT        NOT NULL,
    is_active        BOOLEAN     NOT NULL DEFAULT FALSE,
    birthdate        DATE,
    school           TEXT,
    country          TEXT,
    height           TEXT,                   -- stored as "6-11" (API format)
    weight_lbs       SMALLINT,
    position         TEXT,
    jersey_number    TEXT,                   -- TEXT: can be "00", "1", etc.
    team_id          BIGINT      REFERENCES teams(team_id),   -- NULL = FA / retired
    draft_year       SMALLINT,
    draft_round      SMALLINT,
    draft_number     SMALLINT,
    from_year        SMALLINT,
    to_year          SMALLINT,
    greatest_75_flag BOOLEAN     NOT NULL DEFAULT FALSE,
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_players_is_active ON players (is_active);
CREATE INDEX IF NOT EXISTS idx_players_team_id   ON players (team_id);


-- ----------------------------------------------------------
-- seasons
-- Per-game averages per player, per season, per team, per season type.
-- Sourced from PlayerCareerStats (SeasonTotalsRegularSeason +
-- SeasonTotalsPostSeason). Counting stats are divided by GP in the
-- transformer; ratios (FG%, etc.) are passed through as-is.
--
-- Composite PK handles:
--   - Multi-team seasons: one "TOT" row + one row per team
--   - TOT rows: team_id = NULL, team_abbreviation = 'TOT'
-- ----------------------------------------------------------

CREATE TABLE IF NOT EXISTS seasons (
    player_id         BIGINT            NOT NULL REFERENCES players(player_id),
    season_id         VARCHAR(7)        NOT NULL,   -- "2023-24"
    team_abbreviation VARCHAR(10)       NOT NULL,   -- "LAL" | "TOT"
    season_type       season_type_enum  NOT NULL,
    team_id           BIGINT,                       -- NULL for TOT rows
    player_age        NUMERIC(4, 1),
    gp                SMALLINT,
    gs                SMALLINT,
    -- Per-game averages (counting stats / GP)
    min_pg            NUMERIC(5, 2),
    fgm_pg            NUMERIC(5, 2),
    fga_pg            NUMERIC(5, 2),
    fg3m_pg           NUMERIC(5, 2),
    fg3a_pg           NUMERIC(5, 2),
    ftm_pg            NUMERIC(5, 2),
    fta_pg            NUMERIC(5, 2),
    oreb_pg           NUMERIC(5, 2),
    dreb_pg           NUMERIC(5, 2),
    reb_pg            NUMERIC(5, 2),
    ast_pg            NUMERIC(5, 2),
    stl_pg            NUMERIC(5, 2),
    blk_pg            NUMERIC(5, 2),
    tov_pg            NUMERIC(5, 2),
    pf_pg             NUMERIC(5, 2),
    pts_pg            NUMERIC(5, 2),
    -- Ratios (passed through directly)
    fg_pct            NUMERIC(5, 4),
    fg3_pct           NUMERIC(5, 4),
    ft_pct            NUMERIC(5, 4),

    PRIMARY KEY (player_id, season_id, team_abbreviation, season_type)
);

CREATE INDEX IF NOT EXISTS idx_seasons_player_type
    ON seasons (player_id, season_type);

CREATE INDEX IF NOT EXISTS idx_seasons_season_type
    ON seasons (season_id, season_type);


-- ----------------------------------------------------------
-- accolades
-- Awards and honors per player per season.
-- Sourced from PlayerAwards.
-- Weekly / monthly awards are included; month + week (defaulting
-- to '') are part of the PK to distinguish them from annual awards.
-- ----------------------------------------------------------

CREATE TABLE IF NOT EXISTS accolades (
    player_id   BIGINT      NOT NULL REFERENCES players(player_id),
    season      VARCHAR(7)  NOT NULL,   -- "2023-24"
    description TEXT        NOT NULL,   -- "NBA All-Star", "All-NBA First Team"
    type        TEXT        NOT NULL DEFAULT '',
    team        TEXT,                   -- team abbreviation or conference
    subtype     TEXT,                   -- e.g., all_nba_team_number as text
    month       TEXT        NOT NULL DEFAULT '',
    week        TEXT        NOT NULL DEFAULT '',

    PRIMARY KEY (player_id, season, description, month, week)
);

CREATE INDEX IF NOT EXISTS idx_accolades_player ON accolades (player_id);


-- ----------------------------------------------------------
-- scrape_status
-- Checkpoint table. Re-runs skip players where status = 'complete'.
-- 'failed' rows are retried (reset_failed sets them back to 'pending').
-- ----------------------------------------------------------

CREATE TABLE IF NOT EXISTS scrape_status (
    player_id    BIGINT              PRIMARY KEY,
    status       scrape_status_enum  NOT NULL DEFAULT 'pending',
    attempted_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    error        TEXT,
    retries      SMALLINT            NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_scrape_status_status ON scrape_status (status);
