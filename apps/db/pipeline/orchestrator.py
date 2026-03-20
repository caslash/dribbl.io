"""
pipeline/orchestrator.py — Async engine that wires all components together.

Entry point: run(mode, season, player_id, reset_failed)

Startup sequence:
  1. Create DB pool + run migrations
  2. Seed teams from static data
  3. Resolve which player IDs to process
  4. Seed scrape_status checkpoint table
  5. (Optional) Reset failed players to pending
  6. Fetch pending IDs and process concurrently

Concurrency model:
  - asyncio.Semaphore(settings.concurrency) limits players in flight
  - asyncio.TaskGroup launches all player tasks; each catches its own errors
  - _process_player never raises, so TaskGroup never cancels siblings
"""

from __future__ import annotations

import asyncio

import asyncpg
from curl_cffi.requests import AsyncSession
from rich.progress import (
    BarColumn,
    MofNCompleteColumn,
    Progress,
    SpinnerColumn,
    TimeElapsedColumn,
    TimeRemainingColumn,
)

from config import settings
from db.connection import create_pool, run_migrations
from db.queries import (
    get_pending_player_ids,
    mark_attempted,
    mark_complete,
    mark_failed,
    reset_failed,
    seed_scrape_status,
    upsert_teams,
)
from pipeline.fetcher import NBA_HEADERS, fetch_player
from pipeline.resolver import get_static_teams, resolve_player_ids
from pipeline.transformer import transform
from pipeline.writer import write_player


async def _process_player(
    pool: asyncpg.Pool,
    session: AsyncSession,
    semaphore: asyncio.Semaphore,
    player_id: int,
    progress: Progress,
    task_id: int,
) -> None:
    """
    Fetch, transform, and persist one player. Never raises — all errors are
    caught and written to scrape_status so siblings are unaffected.
    """
    async with pool.acquire() as conn:
        await mark_attempted(conn, player_id)

    try:
        info, career, awards = await fetch_player(session, player_id, semaphore, settings.request_timeout)
        result = transform(info, career, awards)

        async with pool.acquire() as conn:
            await write_player(conn, result)
            await mark_complete(conn, player_id)

    except Exception as exc:  # noqa: BLE001
        if isinstance(exc, ExceptionGroup):
            error_msg = "; ".join(str(e) for e in exc.exceptions)
        else:
            error_msg = str(exc)
        async with pool.acquire() as conn:
            await mark_failed(conn, player_id, error_msg[:500])

    finally:
        progress.advance(task_id)


async def run(
    mode: str,
    season: str | None = None,
    player_id: int | None = None,
    reset_failed_players: bool = False,
) -> None:
    """
    Main pipeline entry point.

    Args:
        mode:                 "full" | "season" | "player"
        season:               Season string "YYYY-YY", required for mode="season"
        player_id:            NBA player ID, required for mode="player"
        reset_failed_players: If True, reset all failed rows to pending before running
    """
    pool = await create_pool(settings)
    await run_migrations(pool)

    # Seed all historical franchises (idempotent upsert)
    async with pool.acquire() as conn:
        await upsert_teams(conn, get_static_teams())

    # Resolve the full set of player IDs for this mode
    all_ids = resolve_player_ids(mode=mode, season=season, player_id=player_id)

    async with pool.acquire() as conn:
        # Register any new players in the checkpoint table
        await seed_scrape_status(conn, all_ids)

        if reset_failed_players:
            n = await reset_failed(conn)
            print(f"Reset {n:,} failed player(s) to pending.")

        # Skip players that already completed in a previous run
        pending_ids = await get_pending_player_ids(conn)

    if not pending_ids:
        print("Nothing to do — all players already complete.")
        await pool.close()
        return

    semaphore = asyncio.Semaphore(settings.concurrency)

    with Progress(
        SpinnerColumn(),
        "[progress.description]{task.description}",
        BarColumn(),
        MofNCompleteColumn(),
        TimeElapsedColumn(),
        TimeRemainingColumn(),
    ) as progress:
        task_id = progress.add_task(
            f"[cyan]{mode}[/] — {len(pending_ids):,} players",
            total=len(pending_ids),
        )

        async with AsyncSession(impersonate="chrome120", headers=NBA_HEADERS) as session:
            async with asyncio.TaskGroup() as tg:
                for pid in pending_ids:
                    tg.create_task(
                        _process_player(
                            pool, session, semaphore,
                            pid, progress, task_id,
                        )
                    )

    # Final summary
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            "SELECT status, COUNT(*) AS n FROM scrape_status GROUP BY status ORDER BY status"
        )

    print("\nScrape summary:")
    for row in rows:
        print(f"  {row['status']:10s} {row['n']:,}")

    await pool.close()
