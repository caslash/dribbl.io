from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime, timezone
from typing import Literal

from pydantic import BaseModel, Field


class PlayerRecord(BaseModel):
    """Bio and physical info for one NBA player. Maps to the `players` table."""

    player_id: int
    first_name: str
    last_name: str
    full_name: str
    is_active: bool = False
    birthdate: date | None = None
    school: str | None = None
    country: str | None = None
    height: str | None = None           # stored as "6-11" (API format)
    weight_lbs: int | None = None
    position: str | None = None
    jersey_number: str | None = None    # TEXT: "00", "1", etc.
    team_id: int | None = None          # None when player has no team
    draft_year: int | None = None
    draft_round: int | None = None
    draft_number: int | None = None
    from_year: int | None = None
    to_year: int | None = None
    greatest_75_flag: bool = False
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )


class SeasonRecord(BaseModel):
    """
    Per-game averages for one player / season / team / season-type combination.
    Maps to the `seasons` table.

    Counting stats are already divided by GP (done in the transformer).
    TOT rows (multi-team seasons) have team_id=None and team_abbreviation='TOT'.
    """

    player_id: int
    season_id: str                      # "2023-24"
    team_abbreviation: str              # "LAL" | "TOT"
    season_type: Literal["Regular Season", "Playoffs"]
    team_id: int | None = None
    player_age: float | None = None
    gp: int | None = None
    gs: int | None = None
    # Per-game averages
    min_pg: float | None = None
    fgm_pg: float | None = None
    fga_pg: float | None = None
    fg3m_pg: float | None = None
    fg3a_pg: float | None = None
    ftm_pg: float | None = None
    fta_pg: float | None = None
    oreb_pg: float | None = None
    dreb_pg: float | None = None
    reb_pg: float | None = None
    ast_pg: float | None = None
    stl_pg: float | None = None
    blk_pg: float | None = None
    tov_pg: float | None = None
    pf_pg: float | None = None
    pts_pg: float | None = None
    # Shooting percentages (passed through as-is)
    fg_pct: float | None = None
    fg3_pct: float | None = None
    ft_pct: float | None = None


class AccoladeRecord(BaseModel):
    """
    One award or honor for a player in a given season.
    Maps to the `accolades` table.
    """

    player_id: int
    season: str                         # "2023-24" (normalized by transformer)
    description: str                    # "NBA All-Star", "All-NBA First Team"
    type: str = ""
    team: str | None = None             # team abbreviation or conference
    subtype: str | None = None          # e.g., All-NBA team number as string
    month: str = ""
    week: str = ""


@dataclass
class TransformedPlayer:
    """Container holding all data extracted for a single player."""

    player: PlayerRecord
    seasons: list[SeasonRecord]
    accolades: list[AccoladeRecord]
