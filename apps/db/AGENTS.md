# AGENTS.md — nba_api

## Overview

`nba_api` is a Python client for the public APIs at [stats.nba.com](https://stats.nba.com) and the live NBA data feed. It requires Python 3.10+ and depends on `requests` and `numpy`. `pandas` is optional but needed to use `.get_data_frame()` methods.

Install with:
```
pip install nba_api
```

The package has two main sub-packages:
- `nba_api.stats` — Historical and aggregated stats from stats.nba.com (large set of endpoints)
- `nba_api.live` — Real-time/today's data from the NBA live data feed (scoreboards, box scores, etc.)

There is also a `nba_api.stats.static` module that provides fast, local lookups of player and team metadata without making HTTP requests.

---

## Basic Usage Pattern

Every stats endpoint is a class. Instantiating the class fires the HTTP request and stores the result. You then access named data sets as attributes, or get everything at once.

```python
from nba_api.stats.endpoints import playercareerstats

career = playercareerstats.PlayerCareerStats(player_id='203999')  # Nikola Jokić

# Access a named dataset as a pandas DataFrame
career.season_totals_regular_season.get_data_frame()

# Or retrieve all data as JSON / dict
career.get_json()
career.get_dict()
```

Each named dataset also has `.get_json()`, `.get_dict()`, and `.get_data_frame()` methods. You can also call `.get_response()` on the top-level object to see the raw HTTP response.

Custom proxies, headers, and timeouts are supported on every request:
```python
player_info = CommonPlayerInfo(
    player_id=2544,
    proxy='127.0.0.1:80',
    headers={'User-Agent': 'Mozilla/5.0 ...'},
    timeout=100
)
```

For live data:
```python
from nba_api.live.nba.endpoints import scoreboard

games = scoreboard.ScoreBoard()
games.get_json()
games.get_dict()
```

---

## Static Module (No HTTP Requests)

`nba_api.stats.static` provides local lookups for players and teams. Use these to resolve names to IDs before calling endpoints.

```python
from nba_api.stats.static import players, teams

# Player lookups
players.find_players_by_full_name('james')
players.find_players_by_first_name('lebron')
players.find_players_by_last_name('^(james|love)$')  # supports regex
players.find_player_by_id(2544)
players.get_players()           # all players (historical + active)
players.get_active_players()
players.get_inactive_players()
players.get_wnba_players()

# Team lookups
teams.get_teams()
teams.find_teams_by_full_name('lakers')
teams.find_teams_by_city('los angeles')
teams.find_teams_by_state('california')
teams.find_teams_by_nickname('lakers')
teams.find_team_by_abbreviation('LAL')
teams.find_team_name_by_id(1610612747)
```

A player dict looks like: `{'id': 2544, 'full_name': 'LeBron James', 'first_name': 'LeBron', 'last_name': 'James', 'is_active': True}`.

---

## Common Parameter Types

These parameter names appear across many endpoints. Understanding them avoids confusion:

- **Season** — Format `"2023-24"`. Required by most stats endpoints.
- **SeasonType** — One of `"Regular Season"`, `"Pre Season"`, `"Playoffs"`, `"All-Star"`.
- **LeagueID** — `"00"` for NBA (default), `"10"` for WNBA, `"20"` for G-League. Many endpoints accept `LeagueIDNullable` which now also defaults to `"00"`.
- **PerMode** — How stats are scaled: `"Totals"`, `"PerGame"`, `"Per48"`, `"Per36"`, `"Per100Possessions"`, etc.
- **MeasureType** — `"Base"`, `"Advanced"`, `"Misc"`, `"Four Factors"`, `"Scoring"`, `"Opponent"`, `"Usage"`, `"Defense"`.
- **PlayerID** / **TeamID** — Integer IDs. Use the static module to look them up.
- **GameID** — 10-digit string (e.g. `"0022300001"`). Prefix `002` = regular season, `004` = playoffs.
- **DateFrom** / **DateTo** — Date strings like `"01/01/2024"`.
- **LastNGames** — Integer, 0 = all games.
- **Month** — Integer 0–12, where 0 = all months.
- **Period** — Quarter/OT number; 0 = full game.
- **Location** — `"Home"` or `"Road"`.
- **Outcome** — `"W"` or `"L"`.
- **SeasonSegment** — `"Pre All-Star"` or `"Post All-Star"`.
- **Conference** — `"East"` or `"West"`.
- **Division** — `"Atlantic"`, `"Central"`, `"Northwest"`, `"Pacific"`, `"Southeast"`, `"Southwest"`.
- **VsConference** / **VsDivision** — Opponent's conference/division filter.
- **PlayerOrTeam** — `"P"` for player-level, `"T"` for team-level.

Nullable parameters can be passed as empty string `""` or omitted entirely.

---

## Stats Endpoints (`nba_api.stats.endpoints`)

### Player Information & Profiles

| Class | Purpose |
|---|---|
| `CommonPlayerInfo` | Bio, physical info, current team, position, draft info, headline stats for one player. |
| `CommonAllPlayers` | List of all players (or active only) with team and season info. Now includes `PLAYER_SLUG` and `TEAM_SLUG`. Use `CommonPlayerInfo` if you need position. |
| `PlayerProfileV2` | Career highs, season stats, playoff stats, and next game for one player. |
| `PlayerCareerStats` | Full season-by-season career totals and per-game stats across regular season, playoffs, college, and All-Star. |
| `PlayerCompare` | Side-by-side stat comparison between two players. |
| `PlayerAwards` | Awards and honors for a player throughout their career. |
| `PlayerNextNGames` | Upcoming scheduled games for a player. |
| `PlayerVsPlayer` | Head-to-head stats comparing two players. |
| `PlayerCareerByCollege` / `PlayerCareerByCollegeRollup` | Career stats grouped by college. |

### Player Game Logs & Splits

| Class | Purpose |
|---|---|
| `PlayerGameLog` | Game-by-game stats for one player in a given season. |
| `PlayerGameLogs` | Multi-player or multi-season game log (more flexible than `PlayerGameLog`). |
| `PlayerGameStreakFinder` | Find games matching specific stat thresholds (e.g., 30+ point games). |
| `PlayerDashboardByGeneralSplits` | Player stats split by home/away, win/loss, month, etc. |
| `PlayerDashboardByClutch` | Player stats in clutch situations. |
| `PlayerDashboardByGameSplits` | Player stats by game score differential, quarter, etc. |
| `PlayerDashboardByLastNGames` | Player stats over the last N games. |
| `PlayerDashboardByShootingSplits` | Player stats by shot type and distance. |
| `PlayerDashboardByTeamPerformance` | Player stats grouped by team performance outcomes. |
| `PlayerDashboardByYearOverYear` | Player stats across multiple seasons for year-over-year comparison. |
| `PlayerDashPtPass` | Passing tracking stats (assists, passes made/received) for a player. |
| `PlayerDashPtReb` | Rebounding tracking stats (contested, putbacks, etc.) for a player. |
| `PlayerDashPtShots` | Shot tracking (pull-up, catch-and-shoot, etc.) for a player. |
| `PlayerDashPtShotDefend` | Defensive shot-contesting stats for a player. |
| `PlayerEstimatedMetrics` | Advanced estimated metrics (e-Net Rating, e-ORTG, e-DRTG, etc.) for players. |
| `PlayerFantasyProfileBarGraph` | Fantasy-relevant stat breakdown for a player. |

### Team Information & Profiles

| Class | Purpose |
|---|---|
| `CommonTeamRoster` | Current or historical roster for a team, including player info and coach info. |
| `CommonTeamYears` | Years a team has been active in the league. |
| `TeamDetails` | Team background (arena, owner, GM, coach), history, Hall of Famers, retired numbers, championships, and social links. |
| `TeamYearByYearStats` | Season-by-season win/loss and stat totals for a franchise. |
| `TeamDashboardByGeneralSplits` | Team stats split by various game-situation categories. |
| `TeamDashboardByClutch` | Team stats in clutch situations. |
| `TeamDashboardByGameSplits` | Team stats split by score differential, quarter, etc. |
| `TeamDashboardByLastNGames` | Team stats over the last N games. |
| `TeamDashboardByShootingSplits` | Team stats by shot type/location. |
| `TeamDashboardByTeamPerformance` | Team stats split by game outcomes. |
| `TeamDashboardByYearOverYear` | Team stats year-over-year. |
| `TeamDashPtPass` | Team passing/assist tracking stats. |
| `TeamDashPtReb` | Team rebounding tracking stats. |
| `TeamDashPtShots` | Team shot tracking stats. |
| `TeamHistoricalLeaders` | All-time statistical leaders for a franchise. |
| `FranchiseHistory` | Full history of all franchises including relocations and name changes. |
| `FranchiseLeaders` | Top statistical leaders in franchise history for points, rebounds, assists, etc. |
| `FranchisePlayers` | All players who have played for a franchise. |

### Box Scores (Game-Level)

| Class | Purpose |
|---|---|
| `BoxScoreTraditionalV2` | Standard box score: points, rebounds, assists, FG%, etc., per player and team. |
| `BoxScoreAdvancedV2` | Advanced box score: true shooting %, net rating, USG%, PACE, PIE, etc. |
| `BoxScoreScoringV2` | Scoring breakdown by shot type and paint/mid-range/3PT zones. |
| `BoxScoreMiscV2` | Misc stats: points off turnovers, fast break points, bench points, etc. |
| `BoxScoreFourFactorsV2` | Dean Oliver's four factors (eFG%, TOV%, ORB%, FT rate) per team. |
| `BoxScoreUsageV2` | Usage statistics per player (USG%, % of team plays used). |
| `BoxScoreDefensiveV2` | Defensive tracking stats per player and team for a game. |
| `BoxScoreSummaryV2` | Game summary: officials, attendance, lead changes, times tied, last meeting, series record. **Note: data availability ends after 4/10/2025; use V3 instead.** |
| `BoxScoreSummaryV3` | Updated game summary with arena details, officials, line scores, inactive players, historical matchups. Preferred over V2. |
| `BoxScorePlayerTrackV2` | Player tracking data: distance, speed, touches, passes, etc. |
| `BoxScoreMatchupsV3` | Matchup-level data showing offensive/defensive player pairings for a game. |

### Scoreboards & Schedules

| Class | Purpose |
|---|---|
| `ScoreboardV2` | Games for a specific date including line scores, standings by day, last meetings, series records. |
| `ScoreboardV3` | Enhanced scoreboard with 10+ datasets including team leaders and series standings. |
| `ScheduleLeagueV2` | Full league schedule for a season. |
| `PlayoffPicture` | Current playoff seeding picture and clinching scenarios. |
| `CommonPlayoffSeries` | Matchups and series results for a given playoff year. |

### League-Wide Stats & Dashboards

| Class | Purpose |
|---|---|
| `LeagueStandings` | Current standings with wins, losses, home/road records, streak info, and more. |
| `LeagueStandingsV3` | Updated version of league standings. |
| `LeagueDashPlayerStats` | Per-player aggregated stats across the whole league for a season; filterable by many dimensions. |
| `LeagueDashTeamStats` | Per-team aggregated stats for the whole league. |
| `LeagueDashLineups` | Stats for all lineups (2–5 man combinations) in the league. |
| `LeagueDashPlayerBioStats` | Player bio info plus stats (age, height, weight, country, experience). |
| `LeagueDashPlayerClutch` | League-wide player stats in clutch time. |
| `LeagueDashTeamClutch` | League-wide team stats in clutch time. |
| `LeagueDashOppPtShot` | Opponent shot-quality allowed stats league-wide. |
| `LeagueDashPlayerPtShot` | Player shot-tracking stats (pull-up, catch-shoot, etc.) league-wide. |
| `LeagueDashTeamPtShot` | Team shot-tracking stats league-wide. |
| `LeagueDashPtStats` | Player/team tracking stats (speed, distance, possessions) league-wide. |
| `LeagueDashPtDefend` | Player-level defensive tracking stats league-wide. |
| `LeagueDashPtTeamDefend` | Team-level defensive tracking stats league-wide. |
| `LeagueGameLog` | Log of all games in the league for a season (team-level or player-level). |
| `LeagueGameFinder` | Find games matching arbitrary criteria across seasons. **Note: `game_id_nullable` filter is ignored by the NBA API — filter client-side with pandas instead.** |
| `LeaguePlayerOnDetails` | Stats for a player while specific teammates are on/off the floor. |
| `LeagueSeasonMatchups` | Aggregated matchup data (offensive/defensive player pairings) across the season. |
| `LeagueLeaders` | League leaders in a specific statistical category for a season. |
| `PlayerLeagueRanking` | A player's rank in each statistical category. |
| `LeagueHustleStatsPlayer` | Hustle stats (charges, deflections, loose balls, contested shots) per player. |
| `LeagueHustleStatsTeam` | Hustle stats per team. |

### Play-by-Play

| Class | Purpose |
|---|---|
| `PlayByPlay` | Original play-by-play for a game (older format). |
| `PlayByPlayV2` | Play-by-play with home/visitor descriptions, score, and player refs. Requires `GameID`, `StartPeriod`, `EndPeriod`. |
| `PlayByPlayV3` | Newer play-by-play format with richer fields: `actionType`, `subType`, `xLegacy`/`yLegacy` coordinates, shot distance/result. Preferred. |

### Shot Charts

| Class | Purpose |
|---|---|
| `ShotChartDetail` | Individual shot attempts for a player or team, with court coordinates (`LOC_X`, `LOC_Y`), shot zone, distance, and make/miss. |
| `ShotChartLeagueWide` | League-average shooting by zone for comparison purposes. |
| `ShotChartLineupDetail` | Shot chart data for a specific lineup. |

### Draft

| Class | Purpose |
|---|---|
| `DraftHistory` | All historical draft picks with player, team, and pick information. |
| `DraftCombineStats` | Aggregate combine measurements for a draft class. |
| `DraftCombinePlayerAnthro` | Anthropometric (body measurement) data from the combine. |
| `DraftCombineDrillResults` | Athletic drill results from the combine. |
| `DraftCombineSpotShooting` | Spot shooting test results from the combine. |
| `DraftCombineNonStationaryShooting` | Non-stationary shooting test results from the combine. |

### Hustle, Tracking & Advanced

| Class | Purpose |
|---|---|
| `SynergyPlayTypes` | Stats broken down by Synergy play type (P&R, isolation, spot-up, etc.). |
| `MatchupsRollup` | Rolled-up matchup stats across the league. |
| `TeamAndPlayersVsPlayers` | Stats for a team and its players when facing specific opposing players. |
| `PlayerDashboardByOpponent` | Player splits vs. specific opponents. |
| `DefenseHub` | Hub for various defensive analytics. |
| `Odds` | Historical betting odds for NBA games (where available). |
| `DunkScoreLeaders` | Advanced dunk tracking (55+ metrics: hang time, vertical, takeoff distance, biomechanics, style). |

### Other / Utility

| Class | Purpose |
|---|---|
| `HomePageLeaders` | Statistical leaders displayed on the NBA homepage. |
| `HomePageV2` | Homepage-style top-8 stat category leaders. |
| `LeadersTiles` | Tile-style stat leaders (used for display widgets). |
| `InfographicFanduelPlayer` | FanDuel-specific player infographic stats. |
| `PlayerFantasyProfileBarGraph` | Fantasy profile bar-graph data for a player. |
| `VideoDetails` | Video availability and metadata for specific plays or games. |
| `VideoEventsAsset` | Asset/URL data for video clips. |
| `VideoStatus` | Status of video availability for a game. |

---

## Live Endpoints (`nba_api.live.nba.endpoints`)

These pull from the NBA's live JSON feed. No API key needed. Data refreshes in near real-time during games.

| Class | Purpose |
|---|---|
| `ScoreBoard` | Today's games with scores, period, game clock, and status. |
| `BoxScore` | Live or final box score for a specific game (traditional stats). |
| `PlayByPlay` | Live play-by-play actions for a game in progress. |

Live endpoints return data in a slightly different structure. Access via `.get_dict()` or `.get_json()`. Game IDs from the live feed can be fed back into stats endpoints.

---

## Important Notes & Known Limitations

- **Rate limiting**: stats.nba.com does not publish rate limits, but aggressive scraping can trigger blocks. Add delays between requests when bulk-fetching.
- **`TeamGameLog` / `TeamGameLogs`**: Deprecated by the NBA; no replacement is available.
- **`BoxScoreSummaryV2`**: Data availability ends after April 10, 2025. Migrate to `BoxScoreSummaryV3`.
- **`LeagueGameFinder` `game_id_nullable`**: The NBA API ignores this parameter — it always returns all games matching other filters. Filter the result by `GAME_ID` client-side using pandas.
- **`LeagueIDNullable`**: As of the 2023-24 season, the NBA API requires an explicit `LeagueID`. The default is now `"00"` (NBA). Pass `league_id_nullable="10"` for WNBA.
- **Position data**: `CommonAllPlayers` does not include a `POSITION` field (NBA API limitation). Use `CommonPlayerInfo` or `CommonTeamRoster` for position.
- **Season format**: Always use `"YYYY-YY"` format (e.g., `"2023-24"`), not just a year.
- **`game_id_nullable` workaround**:
  ```python
  df = league_game_finder.get_data_frames()[0]
  df = df[df['GAME_ID'] == '0022301234']
  ```
