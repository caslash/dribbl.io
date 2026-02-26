"""
database/queries.py — All database operations for the NBA pipeline.

All write operations use INSERT … ON CONFLICT DO UPDATE so the pipeline
is fully idempotent.  Batch upserts use the UNNEST pattern for performance
(one round-trip per table regardless of row count).

Functions accept plain dicts; the writer layer converts Pydantic models
before calling here.
"""

from __future__ import annotations

from datetime import datetime, timezone

import asyncpg

# ---------------------------------------------------------------------------
# teams
# ---------------------------------------------------------------------------

async def upsert_teams(conn: asyncpg.Connection, rows: list[dict]) -> None:
    """Upsert all historical NBA franchises."""
    if not rows:
        return
    await conn.executemany(
        """
        INSERT INTO teams (team_id, abbreviation, nickname, city, state, full_name, year_founded)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (team_id) DO UPDATE SET
            abbreviation = EXCLUDED.abbreviation,
            nickname     = EXCLUDED.nickname,
            city         = EXCLUDED.city,
            state        = EXCLUDED.state,
            full_name    = EXCLUDED.full_name,
            year_founded = EXCLUDED.year_founded
        """,
        [
            (
                r["team_id"],
                r["abbreviation"],
                r["nickname"],
                r["city"],
                r.get("state"),
                r["full_name"],
                r.get("year_founded"),
            )
            for r in rows
        ],
    )


# ---------------------------------------------------------------------------
# players
# ---------------------------------------------------------------------------

async def upsert_player(conn: asyncpg.Connection, row: dict) -> None:
    """Upsert a single player bio record."""
    await conn.execute(
        """
        INSERT INTO players (
            player_id, first_name, last_name, full_name, is_active,
            birthdate, school, country, height, weight_lbs,
            position, jersey_number, team_id,
            draft_year, draft_round, draft_number,
            from_year, to_year, greatest_75_flag, updated_at
        ) VALUES (
            $1,  $2,  $3,  $4,  $5,
            $6,  $7,  $8,  $9,  $10,
            $11, $12, $13,
            $14, $15, $16,
            $17, $18, $19, $20
        )
        ON CONFLICT (player_id) DO UPDATE SET
            first_name       = EXCLUDED.first_name,
            last_name        = EXCLUDED.last_name,
            full_name        = EXCLUDED.full_name,
            is_active        = EXCLUDED.is_active,
            birthdate        = EXCLUDED.birthdate,
            school           = EXCLUDED.school,
            country          = EXCLUDED.country,
            height           = EXCLUDED.height,
            weight_lbs       = EXCLUDED.weight_lbs,
            position         = EXCLUDED.position,
            jersey_number    = EXCLUDED.jersey_number,
            team_id          = EXCLUDED.team_id,
            draft_year       = EXCLUDED.draft_year,
            draft_round      = EXCLUDED.draft_round,
            draft_number     = EXCLUDED.draft_number,
            from_year        = EXCLUDED.from_year,
            to_year          = EXCLUDED.to_year,
            greatest_75_flag = EXCLUDED.greatest_75_flag,
            updated_at       = EXCLUDED.updated_at
        """,
        row["player_id"],
        row["first_name"],
        row["last_name"],
        row["full_name"],
        row.get("is_active", False),
        row.get("birthdate"),
        row.get("school"),
        row.get("country"),
        row.get("height"),
        row.get("weight_lbs"),
        row.get("position"),
        row.get("jersey_number"),
        row.get("team_id"),
        row.get("draft_year"),
        row.get("draft_round"),
        row.get("draft_number"),
        row.get("from_year"),
        row.get("to_year"),
        row.get("greatest_75_flag", False),
        row.get("updated_at", datetime.now(timezone.utc)),
    )


# ---------------------------------------------------------------------------
# seasons
# ---------------------------------------------------------------------------

async def upsert_seasons(conn: asyncpg.Connection, rows: list[dict]) -> None:
    """
    Batch-upsert season per-game averages via UNNEST.
    Each row covers one player / season / team / season_type combination.
    """
    if not rows:
        return

    await conn.execute(
        """
        INSERT INTO seasons (
            player_id, season_id, team_abbreviation, season_type,
            team_id, player_age, gp, gs,
            min_pg, fgm_pg, fga_pg,
            fg3m_pg, fg3a_pg,
            ftm_pg, fta_pg,
            oreb_pg, dreb_pg, reb_pg,
            ast_pg, stl_pg, blk_pg, tov_pg, pf_pg, pts_pg,
            fg_pct, fg3_pct, ft_pct
        )
        SELECT * FROM UNNEST(
            $1::bigint[],  $2::varchar[], $3::varchar[],  $4::season_type_enum[],
            $5::bigint[],  $6::numeric[], $7::smallint[], $8::smallint[],
            $9::numeric[], $10::numeric[], $11::numeric[],
            $12::numeric[], $13::numeric[],
            $14::numeric[], $15::numeric[],
            $16::numeric[], $17::numeric[], $18::numeric[],
            $19::numeric[], $20::numeric[], $21::numeric[], $22::numeric[], $23::numeric[], $24::numeric[],
            $25::numeric[], $26::numeric[], $27::numeric[]
        ) AS t(
            player_id, season_id, team_abbreviation, season_type,
            team_id, player_age, gp, gs,
            min_pg, fgm_pg, fga_pg,
            fg3m_pg, fg3a_pg,
            ftm_pg, fta_pg,
            oreb_pg, dreb_pg, reb_pg,
            ast_pg, stl_pg, blk_pg, tov_pg, pf_pg, pts_pg,
            fg_pct, fg3_pct, ft_pct
        )
        ON CONFLICT (player_id, season_id, team_abbreviation, season_type) DO UPDATE SET
            team_id          = EXCLUDED.team_id,
            player_age       = EXCLUDED.player_age,
            gp               = EXCLUDED.gp,
            gs               = EXCLUDED.gs,
            min_pg           = EXCLUDED.min_pg,
            fgm_pg           = EXCLUDED.fgm_pg,
            fga_pg           = EXCLUDED.fga_pg,
            fg3m_pg          = EXCLUDED.fg3m_pg,
            fg3a_pg          = EXCLUDED.fg3a_pg,
            ftm_pg           = EXCLUDED.ftm_pg,
            fta_pg           = EXCLUDED.fta_pg,
            oreb_pg          = EXCLUDED.oreb_pg,
            dreb_pg          = EXCLUDED.dreb_pg,
            reb_pg           = EXCLUDED.reb_pg,
            ast_pg           = EXCLUDED.ast_pg,
            stl_pg           = EXCLUDED.stl_pg,
            blk_pg           = EXCLUDED.blk_pg,
            tov_pg           = EXCLUDED.tov_pg,
            pf_pg            = EXCLUDED.pf_pg,
            pts_pg           = EXCLUDED.pts_pg,
            fg_pct           = EXCLUDED.fg_pct,
            fg3_pct          = EXCLUDED.fg3_pct,
            ft_pct           = EXCLUDED.ft_pct
        """,
        [r["player_id"]         for r in rows],
        [r["season_id"]         for r in rows],
        [r["team_abbreviation"] for r in rows],
        [r["season_type"]       for r in rows],
        [r.get("team_id")       for r in rows],
        [r.get("player_age")    for r in rows],
        [r.get("gp")            for r in rows],
        [r.get("gs")            for r in rows],
        [r.get("min_pg")        for r in rows],
        [r.get("fgm_pg")        for r in rows],
        [r.get("fga_pg")        for r in rows],
        [r.get("fg3m_pg")       for r in rows],
        [r.get("fg3a_pg")       for r in rows],
        [r.get("ftm_pg")        for r in rows],
        [r.get("fta_pg")        for r in rows],
        [r.get("oreb_pg")       for r in rows],
        [r.get("dreb_pg")       for r in rows],
        [r.get("reb_pg")        for r in rows],
        [r.get("ast_pg")        for r in rows],
        [r.get("stl_pg")        for r in rows],
        [r.get("blk_pg")        for r in rows],
        [r.get("tov_pg")        for r in rows],
        [r.get("pf_pg")         for r in rows],
        [r.get("pts_pg")        for r in rows],
        [r.get("fg_pct")        for r in rows],
        [r.get("fg3_pct")       for r in rows],
        [r.get("ft_pct")        for r in rows],
    )


# ---------------------------------------------------------------------------
# accolades
# ---------------------------------------------------------------------------

async def upsert_accolades(conn: asyncpg.Connection, rows: list[dict]) -> None:
    """Batch-upsert player awards via UNNEST."""
    if not rows:
        return

    await conn.execute(
        """
        INSERT INTO accolades (player_id, season, description, type, team, subtype, month, week)
        SELECT * FROM UNNEST(
            $1::bigint[], $2::varchar[], $3::text[], $4::text[],
            $5::text[],   $6::text[],   $7::text[], $8::text[]
        ) AS t(player_id, season, description, type, team, subtype, month, week)
        ON CONFLICT (player_id, season, description, month, week) DO UPDATE SET
            type    = EXCLUDED.type,
            team    = EXCLUDED.team,
            subtype = EXCLUDED.subtype
        """,
        [r["player_id"]          for r in rows],
        [r["season"]             for r in rows],
        [r["description"]        for r in rows],
        [r.get("type", "")       for r in rows],
        [r.get("team")           for r in rows],
        [r.get("subtype")        for r in rows],
        [r.get("month", "")      for r in rows],
        [r.get("week", "")       for r in rows],
    )


# ---------------------------------------------------------------------------
# scrape_status
# ---------------------------------------------------------------------------

async def seed_scrape_status(conn: asyncpg.Connection, player_ids: list[int]) -> None:
    """
    Insert 'pending' rows for players not yet tracked.
    ON CONFLICT DO NOTHING preserves any existing status (complete / failed).
    """
    if not player_ids:
        return
    await conn.execute(
        """
        INSERT INTO scrape_status (player_id)
        SELECT * FROM UNNEST($1::bigint[])
        ON CONFLICT (player_id) DO NOTHING
        """,
        player_ids,
    )


async def mark_attempted(conn: asyncpg.Connection, player_id: int) -> None:
    await conn.execute(
        """
        UPDATE scrape_status
        SET attempted_at = NOW()
        WHERE player_id = $1
        """,
        player_id,
    )


async def mark_complete(conn: asyncpg.Connection, player_id: int) -> None:
    await conn.execute(
        """
        UPDATE scrape_status
        SET status = 'complete', completed_at = NOW(), error = NULL
        WHERE player_id = $1
        """,
        player_id,
    )


async def mark_failed(conn: asyncpg.Connection, player_id: int, error: str) -> None:
    await conn.execute(
        """
        UPDATE scrape_status
        SET status = 'failed', error = $2, retries = retries + 1
        WHERE player_id = $1
        """,
        player_id,
        error,
    )


async def get_pending_player_ids(conn: asyncpg.Connection) -> list[int]:
    """Return IDs where status is 'pending' or 'failed' (eligible for processing)."""
    rows = await conn.fetch(
        """
        SELECT player_id FROM scrape_status
        WHERE status IN ('pending', 'failed')
        ORDER BY player_id
        """
    )
    return [r["player_id"] for r in rows]


async def reset_failed(conn: asyncpg.Connection) -> int:
    """Reset all 'failed' rows back to 'pending' for a retry run. Returns row count."""
    result = await conn.execute(
        """
        UPDATE scrape_status
        SET status = 'pending', error = NULL
        WHERE status = 'failed'
        """
    )
    # asyncpg returns "UPDATE N" as a string
    return int(result.split()[-1])
