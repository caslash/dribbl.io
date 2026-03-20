"""
pipeline/writer.py — Persists a TransformedPlayer to the database.

Bridges the model layer and the DB layer: converts Pydantic models to plain
dicts (via model_dump()) and delegates to db.queries for the actual upserts.
"""

from __future__ import annotations

import asyncpg

from db.queries import upsert_accolades, upsert_player, upsert_seasons
from models.player import TransformedPlayer


async def write_player(conn: asyncpg.Connection, result: TransformedPlayer) -> None:
    """
    Upsert all data for one player: bio, season averages, and accolades.

    Uses a single connection (no transaction wrapping — each upsert is
    independently idempotent, so partial writes on failure are safe to retry).

    Args:
        conn:   An asyncpg connection acquired from the pool.
        result: Output of pipeline.transformer.transform().
    """
    await upsert_player(conn, result.player.model_dump())

    if result.seasons:
        await upsert_seasons(conn, [s.model_dump() for s in result.seasons])

    if result.accolades:
        await upsert_accolades(conn, [a.model_dump() for a in result.accolades])
