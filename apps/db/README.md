# @dribblio/db

Python data pipeline that scrapes NBA stats from `stats.nba.com` and writes them into the dribbl.io PostgreSQL database. Requires Python 3.10+.

## Dependencies

```
curl-cffi      # HTTP client
asyncpg        # Async PostgreSQL driver
nba_api        # NBA stats API client
pandas         # Data transformation
pydantic-settings  # Configuration from env vars
tenacity       # Retry logic
rich           # Terminal output formatting
```

## Setup

```bash
pip install -r requirements.txt
```

Set the `DATABASE_URL` environment variable (or configure `config.py`) before running.

## Usage

```bash
python main.py --mode <mode> [options]
```

### Modes

| Mode     | Description                                      | Required flags         |
| -------- | ------------------------------------------------ | ---------------------- |
| `full`   | Scrape all historical players                    | —                      |
| `season` | Scrape the active roster for a single season     | `--season YYYY-YY`     |
| `player` | Scrape a single player by NBA player ID          | `--player-id <id>`     |

### Options

| Flag             | Description                                                    |
| ---------------- | -------------------------------------------------------------- |
| `--season YYYY-YY` | Season string, e.g. `2023-24`. Required for `season` mode.  |
| `--player-id ID`  | NBA player ID integer. Required for `player` mode.           |
| `--reset-failed` | Reset previously failed players back to pending before running. |

### Examples

```bash
# Full historical scrape
python main.py --mode full

# Scrape one season
python main.py --mode season --season 2023-24

# Scrape one player
python main.py --mode player --player-id 2544

# Retry previously failed players
python main.py --mode full --reset-failed
```

## Source Structure

```
apps/db/
├── main.py              # Entry point and CLI argument parsing
├── config.py            # Configuration (database URL, etc.)
├── requirements.txt
├── models/
│   └── player.py        # Player data model
├── pipeline/
│   ├── orchestrator.py  # Main pipeline runner — coordinates all stages
│   ├── fetcher.py       # Fetch data from stats.nba.com via nba_api
│   ├── transformer.py   # Transform raw API data into DB-ready records
│   ├── resolver.py      # Resolve NBA IDs to DB IDs
│   └── writer.py        # Write records to PostgreSQL via asyncpg
├── db/
│   ├── connection.py    # Async connection pool management
│   ├── queries.py       # Reusable query helpers
│   └── migrations/      # Database migration scripts
└── proxy/               # Proxy utilities for rate-limit avoidance
```

## Database Tables Written

| Table       | Description                                                     |
| ----------- | --------------------------------------------------------------- |
| `players`   | NBA player records (name, draft info, etc.)                     |
| `teams`     | NBA team records including historical franchises                |
| `seasons`   | Per-player, per-season, per-team regular season stats           |
| `accolades` | Awards — MVP seasons, All-Star selections, championships, etc.  |

The `pools` table is written by the API server, not this pipeline.

## Data Notes

- Only **Regular Season** data is ingested; preseason and playoffs are excluded.
- `TOT` rows (trade-year aggregates) are excluded — each team stint is stored separately.
- Consecutive same-team stints are collapsed into a single entry for the Career Path game.
- Franchise relocations (e.g. SuperSonics → Thunder) require manual abbreviation mapping.
- `stats.nba.com` does not publish rate limits — add delays between requests when running bulk scrapes.
