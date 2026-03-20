"""
pipeline/resolver.py — Determines which player IDs to process.

Called once at startup (synchronous) before the async loop begins.
Uses nba_api.stats.static for zero-HTTP local lookups (full / player modes).
Uses CommonAllPlayers (one HTTP call) for season mode.
"""

from __future__ import annotations


def resolve_player_ids(
    mode: str,
    season: str | None = None,
    player_id: int | None = None,
) -> list[int]:
    """
    Return the list of NBA player IDs to process for the given run mode.

    Args:
        mode:      "full" | "season" | "player"
        season:    Required for mode="season". Format "YYYY-YY" (e.g. "2023-24").
        player_id: Required for mode="player".

    Returns:
        List of integer player IDs.
    """
    if mode == "player":
        if player_id is None:
            raise ValueError("--player-id is required for player mode")
        return [player_id]

    if mode == "season":
        if not season:
            raise ValueError("--season is required for season mode")
        return _resolve_season(season)

    # mode == "full"
    return _resolve_full()


def _resolve_full() -> list[int]:
    """All historical + active players from local static data (no HTTP)."""
    from nba_api.stats.static import players
    return [p["id"] for p in players.get_players()]


def _resolve_season(season: str) -> list[int]:
    """
    Players active in a specific season via CommonAllPlayers.
    Makes one synchronous HTTP request.
    """
    from nba_api.stats.endpoints import commonallplayers

    resp = commonallplayers.CommonAllPlayers(
        league_id="00",
        season=season,
        is_only_current_season=1,
    )
    result_sets = resp.get_dict()["resultSets"]
    headers = result_sets[0]["headers"]
    rows = result_sets[0]["rowSet"]
    pid_idx = headers.index("PERSON_ID")
    return [int(row[pid_idx]) for row in rows]


def get_static_teams() -> list[dict]:
    """
    All NBA franchises from local static data — zero HTTP requests.
    Returns dicts ready for db.queries.upsert_teams().
    """
    from nba_api.stats.static import teams

    return [
        {
            "team_id": t["id"],
            "abbreviation": t["abbreviation"],
            "nickname": t["nickname"],
            "city": t["city"],
            "state": t.get("state"),
            "full_name": t["full_name"],
            "year_founded": t.get("year_founded"),
        }
        for t in teams.get_teams()
    ]
