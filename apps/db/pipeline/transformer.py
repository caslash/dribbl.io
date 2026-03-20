"""
pipeline/transformer.py — Pure transformation functions.

Takes three raw JSON dicts (one per NBA API endpoint) and produces a
TransformedPlayer. No I/O, no side effects; safe to unit-test in isolation.

Raw NBA API response structure:
{
  "resultSets": [
    {
      "name": "DataSetName",
      "headers": ["COL1", "COL2", ...],
      "rowSet": [[val1, val2, ...], ...]
    }
  ]
}
"""

from __future__ import annotations

from datetime import date

from models.player import AccoladeRecord, PlayerRecord, SeasonRecord, TransformedPlayer

# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

def _rows(response: dict, name: str) -> list[dict]:
    """Return the named resultSet as a list of {header: value} dicts."""
    for rs in response.get("resultSets", []):
        if rs["name"] == name:
            headers = rs["headers"]
            return [dict(zip(headers, row)) for row in rs["rowSet"]]
    return []


def _str(val) -> str | None:
    """Return None for None, empty string, or whitespace-only values."""
    if val is None:
        return None
    s = str(val).strip()
    return s if s else None


def _int(val) -> int | None:
    """Coerce to int; return None for None, empty string, or 0-like falsy."""
    if val is None or val == "" or val == 0:
        return None
    try:
        return int(val)
    except (ValueError, TypeError):
        return None


def _int_team(val) -> int | None:
    """Like _int but specifically for TEAM_ID: 0 means 'no team' → None.
    G-League/affiliate IDs (1610610xxx, 1610611xxx) are also mapped to None
    because they are not present in the teams table."""
    try:
        v = int(val)
    except (ValueError, TypeError):
        return None
    if v == 0:
        return None
    # NBA franchise IDs are 1610612xxx; non-NBA IDs are below 1610612000
    if v < 1610612000:
        return None
    return v


def _float(val) -> float | None:
    if val is None or val == "":
        return None
    try:
        return float(val)
    except (ValueError, TypeError):
        return None


def _bool_flag(val) -> bool:
    """Handle NBA API flag fields: 'Y'/1/True → True, everything else → False."""
    if isinstance(val, bool):
        return val
    if isinstance(val, int):
        return val == 1
    if isinstance(val, str):
        return val.strip().upper() == "Y"
    return False


def _per_game(total, gp: int | None) -> float | None:
    """Divide a season total by games played; return None if gp is None or 0."""
    if gp is None or gp == 0 or total is None or total == "":
        return None
    try:
        return round(float(total) / gp, 2)
    except (ValueError, TypeError):
        return None


def _parse_date(val) -> date | None:
    """Parse NBA API date strings like '1994-09-19T00:00:00' → date."""
    if not val:
        return None
    try:
        # Strip time component if present
        return date.fromisoformat(str(val).split("T")[0])
    except ValueError:
        return None


def _normalize_season(raw: str | None) -> str:
    """
    Normalize season strings to "YYYY-YY" format.

    PlayerCareerStats returns "2023-24" (already correct).
    PlayerAwards returns the start year only: "2023" → "2023-24".
    """
    if not raw:
        return ""
    raw = str(raw).strip()
    if len(raw) == 4 and raw.isdigit():
        year = int(raw)
        return f"{year}-{str(year + 1)[-2:]}"
    return raw  # already "YYYY-YY"


# ---------------------------------------------------------------------------
# Section transformers
# ---------------------------------------------------------------------------

def _build_player(info_response: dict) -> PlayerRecord:
    rows = _rows(info_response, "CommonPlayerInfo")
    if not rows:
        raise ValueError("CommonPlayerInfo resultSet missing or empty")
    r = rows[0]

    return PlayerRecord(
        player_id=int(r["PERSON_ID"]),
        first_name=r["FIRST_NAME"],
        last_name=r["LAST_NAME"],
        full_name=r["DISPLAY_FIRST_LAST"],
        is_active=r.get("ROSTERSTATUS", "") == "Active",
        birthdate=_parse_date(r.get("BIRTHDATE")),
        school=_str(r.get("SCHOOL")),
        country=_str(r.get("COUNTRY")),
        height=_str(r.get("HEIGHT")),
        weight_lbs=_int(r.get("WEIGHT")),
        position=_str(r.get("POSITION")),
        jersey_number=_str(r.get("JERSEY")),
        team_id=_int_team(r.get("TEAM_ID")),
        draft_year=_int(r.get("DRAFT_YEAR")),
        draft_round=_int(r.get("DRAFT_ROUND")),
        draft_number=_int(r.get("DRAFT_NUMBER")),
        from_year=_int(r.get("FROM_YEAR")),
        to_year=_int(r.get("TO_YEAR")),
        greatest_75_flag=_bool_flag(r.get("GREATEST_75_FLAG")),
    )


def _build_seasons(career_response: dict, player_id: int) -> list[SeasonRecord]:
    datasets: list[tuple[str, str]] = [
        ("SeasonTotalsRegularSeason", "Regular Season"),
        ("SeasonTotalsPostSeason", "Playoffs"),
    ]
    seasons: list[SeasonRecord] = []

    for result_set_name, season_type in datasets:
        for r in _rows(career_response, result_set_name):
            team_abbr = _str(r.get("TEAM_ABBREVIATION"))
            if not team_abbr:
                continue  # skip G-League/international rows with no team abbreviation

            gp = _int(r.get("GP"))

            seasons.append(SeasonRecord(
                player_id=player_id,
                season_id=r["SEASON_ID"],
                team_abbreviation=team_abbr,
                season_type=season_type,  # type: ignore[arg-type]
                team_id=_int_team(r.get("TEAM_ID")),
                player_age=_float(r.get("PLAYER_AGE")),
                gp=gp,
                gs=_int(r.get("GS")),
                min_pg=_per_game(r.get("MIN"), gp),
                fgm_pg=_per_game(r.get("FGM"), gp),
                fga_pg=_per_game(r.get("FGA"), gp),
                fg3m_pg=_per_game(r.get("FG3M"), gp),
                fg3a_pg=_per_game(r.get("FG3A"), gp),
                ftm_pg=_per_game(r.get("FTM"), gp),
                fta_pg=_per_game(r.get("FTA"), gp),
                oreb_pg=_per_game(r.get("OREB"), gp),
                dreb_pg=_per_game(r.get("DREB"), gp),
                reb_pg=_per_game(r.get("REB"), gp),
                ast_pg=_per_game(r.get("AST"), gp),
                stl_pg=_per_game(r.get("STL"), gp),
                blk_pg=_per_game(r.get("BLK"), gp),
                tov_pg=_per_game(r.get("TOV"), gp),
                pf_pg=_per_game(r.get("PF"), gp),
                pts_pg=_per_game(r.get("PTS"), gp),
                fg_pct=_float(r.get("FG_PCT")),
                fg3_pct=_float(r.get("FG3_PCT")),
                ft_pct=_float(r.get("FT_PCT")),
            ))

    return seasons


def _build_accolades(awards_response: dict, player_id: int) -> list[AccoladeRecord]:
    accolades: list[AccoladeRecord] = []

    for r in _rows(awards_response, "PlayerAwards"):
        description = _str(r.get("DESCRIPTION"))
        if not description:
            continue  # skip rows with no award name

        raw_subtype = r.get("ALL_NBA_TEAM_NUMBER")
        # API returns whitespace strings and 0 as "no value"
        raw_subtype_str = str(raw_subtype).strip() if raw_subtype is not None else ""
        subtype = raw_subtype_str if raw_subtype_str and raw_subtype_str != "0" else None

        accolades.append(AccoladeRecord(
            player_id=player_id,
            season=_normalize_season(r.get("SEASON")),
            description=description,
            type=_str(r.get("TYPE")) or "",
            team=_str(r.get("TEAM")),
            subtype=subtype,
            month=_str(r.get("MONTH")) or "",
            week=_str(r.get("WEEK")) or "",
        ))

    return accolades


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def transform(
    player_info: dict,
    career_stats: dict,
    awards: dict,
) -> TransformedPlayer:
    """
    Merge three raw NBA API JSON responses into a TransformedPlayer.

    Args:
        player_info:  Raw JSON dict from /commonplayerinfo
        career_stats: Raw JSON dict from /playercareerstats
        awards:       Raw JSON dict from /playerawards

    Returns:
        TransformedPlayer with player, seasons, and accolades populated.

    Raises:
        ValueError: If the CommonPlayerInfo resultSet is missing (bad response).
    """
    player = _build_player(player_info)
    seasons = _build_seasons(career_stats, player.player_id)
    accolades = _build_accolades(awards, player.player_id)

    return TransformedPlayer(
        player=player,
        seasons=seasons,
        accolades=accolades,
    )
