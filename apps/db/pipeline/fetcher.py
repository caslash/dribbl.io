"""
pipeline/fetcher.py — Async HTTP layer for the NBA Stats API.

Uses curl-cffi (Chrome TLS impersonation) instead of aiohttp because
stats.nba.com performs TLS fingerprint checks that block standard Python
HTTP clients. curl-cffi mimics a real Chrome browser at the TLS layer.

Tenacity handles per-request retries with exponential backoff.
Concurrency is controlled by the semaphore passed from the orchestrator.
"""

from __future__ import annotations

import asyncio
import random

from curl_cffi.requests import AsyncSession
from curl_cffi.requests.exceptions import ConnectionError, HTTPError, RequestException, Timeout
from tenacity import (
    retry,
    retry_if_exception,
    stop_after_attempt,
    wait_exponential,
)

_BASE = "https://stats.nba.com"

# Extra NBA-specific headers layered on top of Chrome impersonation.
NBA_HEADERS: dict[str, str] = {
    "Referer": "https://www.nba.com/",
    "x-nba-stats-origin": "stats",
    "x-nba-stats-token": "true",
}

def _should_retry(exc: BaseException) -> bool:
    """Retry transient errors; do NOT retry 404 (player genuinely missing)."""
    if isinstance(exc, HTTPError) and exc.response is not None and exc.response.status_code == 404:
        return False
    return isinstance(exc, (RequestException, ConnectionError, Timeout))


_RETRY = retry(
    stop=stop_after_attempt(5),
    wait=wait_exponential(multiplier=1, min=2, max=30),
    retry=retry_if_exception(_should_retry),
    reraise=True,
)


@_RETRY
async def _fetch_one(session: AsyncSession, path: str, params: dict, request_timeout: int) -> dict:
    """Fetch a single NBA Stats endpoint and return parsed JSON."""
    async with asyncio.timeout(request_timeout):
        resp = await session.get(f"{_BASE}{path}", params=params)
        resp.raise_for_status()
        return resp.json()


async def fetch_player(
    session: AsyncSession,
    player_id: int,
    semaphore: asyncio.Semaphore,
    request_timeout: int,
) -> tuple[dict, dict, dict]:
    """
    Fetch all three endpoints for one player concurrently.

    Each request is individually time-bounded by asyncio.timeout; tenacity
    retries fire inside that boundary. The semaphore slot is held for the
    duration of all 3 requests so that one player counts as one "in flight"
    slot (matching the concurrency=10 design intent).

    Returns:
        (player_info, career_stats, awards) — raw JSON dicts ready for
        pipeline.transformer.transform().

    Raises:
        curl_cffi.requests.exceptions.RequestException: on failure after all retries.
        ExceptionGroup: if multiple tasks fail inside TaskGroup.
    """

    async with semaphore:
        await asyncio.sleep(random.uniform(0.6, 1.5))
        async with asyncio.TaskGroup() as tg:
            t_info = tg.create_task(
                _fetch_one(session, "/stats/commonplayerinfo", {"PlayerID": player_id, "LeagueID": "00"}, request_timeout)
            )
            t_career = tg.create_task(
                _fetch_one(session, "/stats/playercareerstats", {"PlayerID": player_id, "PerMode": "Totals", "LeagueID": "00"}, request_timeout)
            )
            t_awards = tg.create_task(
                _fetch_one(session, "/stats/playerawards", {"PlayerID": player_id}, request_timeout)
            )

    return t_info.result(), t_career.result(), t_awards.result()
