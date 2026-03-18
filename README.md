# dribbl.io

A multiplayer NBA-themed game suite. Two game modes share a NestJS API, a PostgreSQL database of NBA players and stats, and real-time WebSocket communication via Socket.io.

## Game Modes

### Career Path

Single-player guessing game. The player sees an ordered sequence of NBA team logos representing a player's career path and must identify a player with that exact team history. Supports a lives-based mode or infinite play.

### NBA All-Time Draft

Multiplayer room-based drafting game. Participants take turns selecting all-time NBA players to build their dream team. Supports snake and linear draft orders, multiple pool types (MVP seasons, franchise-based), and shareable results graphics.

## Repository Structure

```
dribbl.io/
├── apps/
│   ├── api/      # NestJS REST + WebSocket API (port 3002)
│   ├── web/      # Vite + React frontend (port 3000)
│   ├── db/       # Python data pipeline (stats.nba.com → PostgreSQL)
│   └── cli/      # TypeScript terminal client for dev/testing
└── packages/
    ├── types/              # @dribblio/types — shared TypeScript types
    ├── ui/                 # @dribblio/ui — shared React component library
    ├── typescript-config/  # Shared tsconfig bases
    └── eslint-config/      # Shared ESLint config
```

Each app has its own `README.md` with setup and usage details.

## Tech Stack

| Layer          | Technology                          |
| -------------- | ----------------------------------- |
| Backend        | NestJS 11, TypeORM, PostgreSQL       |
| Real-time      | Socket.io                           |
| State machines | XState v5                           |
| Frontend       | React 19, Vite, Tailwind CSS         |
| Routing        | React Router 7                      |
| Data pipeline  | Python 3.10+, nba_api, asyncpg      |
| Monorepo       | Turborepo, npm workspaces           |

## Getting Started

Install dependencies from the repo root:

```bash
npm install
```

### Run all apps in development

```bash
npm run dev
```

This starts the API (port 3002) and web app (port 3000) concurrently via Turborepo.

### Build

```bash
npm run build
```

### Type-check

```bash
npm run check-types
```

### Lint

```bash
npm run lint
```

### Test

```bash
npm test
```

## Database

PostgreSQL. The `api_user` role has read access to all tables and write access only to `pools`.

| Table       | Description                                             |
| ----------- | ------------------------------------------------------- |
| `players`   | NBA player records                                      |
| `teams`     | NBA team records, including historical franchises       |
| `seasons`   | Per-player, per-season, per-team regular season stats   |
| `accolades` | Awards — MVP seasons, All-Star selections, etc.         |
| `pools`     | Saved draft pools created by users                      |

The database is populated by the Python pipeline in `apps/db`. See its README for setup and usage.

## Environment Variables

Each app reads its own environment variables. See the app-level READMEs for the full list. At minimum:

| Variable          | App | Description                           |
| ----------------- | --- | ------------------------------------- |
| `PG_HOST`         | api | PostgreSQL host                       |
| `PG_PORT`         | api | PostgreSQL port                       |
| `PG_NBA_USERNAME` | api | DB username                           |
| `PG_NBA_PASSWORD` | api | DB password                           |
| `PG_NBA_DATABASE` | api | DB name                               |
| `DATABASE_URL`    | db  | PostgreSQL connection string          |
| `DRIBBL_API_URL`  | cli | API base URL (default: localhost:3002)|
