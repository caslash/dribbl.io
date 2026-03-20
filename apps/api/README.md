# @dribblio/api

NestJS REST + WebSocket API for dribbl.io. Runs on port 3001. All routes are prefixed with `/api`.

## Stack

- **NestJS 11** — framework (modules, DI, controllers, gateways)
- **TypeORM** — PostgreSQL ORM; entities sourced from `@dribblio/types`
- **XState v5** — state machines for stateful game modes
- **Socket.io** — real-time WebSocket communication via NestJS gateways
- **Vitest** — unit and E2E tests

## Getting Started

```bash
npm install
npm run start:dev
```

Requires the environment variables below to be set. Copy `.env.example` to `.env` and fill in values.

## Environment Variables

| Variable          | Description                   |
| ----------------- | ----------------------------- |
| `PG_HOST`         | PostgreSQL host               |
| `PG_PORT`         | PostgreSQL port               |
| `PG_NBA_USERNAME` | DB username                   |
| `PG_NBA_PASSWORD` | DB password                   |
| `PG_NBA_DATABASE` | DB name                       |
| `PORT`            | Server port (default: `3001`) |

## Scripts

```bash
npm run start:dev   # Development with watch mode
npm run start:prod  # Production
npm run build       # Compile TypeScript
npm test            # Run unit tests
npm run test:watch  # Unit tests in watch mode
npm run test:cov    # Unit tests with coverage
npm run test:e2e    # E2E tests
npm run check-types # Type-check only
npm run lint        # ESLint
```

## Source Structure

```
src/
├── main.ts               # Bootstrap: ValidationPipe, /api prefix, port 3001
├── app.module.ts         # Root module: TypeORM config, imports NbaModule
└── nba/                  # All game and domain logic
    ├── nba.module.ts
    ├── careerpath/       # Career Path game mode (WebSocket + XState)
    ├── draft/            # Draft game mode (WebSocket + XState)
    ├── pool/             # Pool management (REST)
    ├── player/           # Player data (REST)
    └── team/             # Team data (REST)
```

Each feature module follows this layout:

```
feature/
├── feature.module.ts
├── feature.service.ts
├── feature.controller.ts     # REST endpoints
├── feature.gateway.ts        # WebSocket gateway
├── feature.*.spec.ts         # Tests co-located with source
└── machine/                  # XState machine (stateful modes only)
    ├── statemachine.ts       # Machine definition
    ├── statemachine.spec.ts
    ├── guards.ts
    ├── actions/
    │   ├── assigns.ts        # Context mutation actions
    │   └── notifies.ts       # Socket.io emit actions
    └── actors/
        ├── websocket.ts      # Bidirectional Socket.io actor
        └── timer.ts          # Turn timer actor (draft only)
```

## Game Modes

### Career Path (`/careerpath`)

Single-player WebSocket game. One XState machine per room. Rooms are created via `POST /api/careerpath/room` and cleaned up when the machine reaches its `closed` final state.

**Socket namespace:** `/careerpath`

**Inbound events (client → server):**

| Event                 | Payload                                 | Description                             |
| --------------------- | --------------------------------------- | --------------------------------------- |
| `SAVE_CONFIG`         | `{ config: { lives: number \| null } }` | Configure lives; omit/null for infinite |
| `START_GAME`          | —                                       | Begin the game                          |
| `USER_GUESS`          | `{ guess: { guessId: number } }`        | Submit a player ID as guess             |
| `SKIP`                | —                                       | Skip the current round                  |
| `PLAYER_DISCONNECTED` | —                                       | Graceful disconnect; triggers cleanup   |

**Outbound events (server → client):**

| Event                    | Payload                                                    | Description                       |
| ------------------------ | ---------------------------------------------------------- | --------------------------------- |
| `NOTIFY_CONFIG_SAVED`    | `{ config }`                                               | Config acknowledged               |
| `NOTIFY_NEXT_ROUND`      | `{ score, team_history: string[], lives: number \| null }` | New round data                    |
| `NOTIFY_CORRECT_GUESS`   | `{ validAnswers }`                                         | Correct — includes all co-answers |
| `NOTIFY_INCORRECT_GUESS` | `{ lives }`                                                | Wrong guess; remaining lives      |
| `NOTIFY_SKIP_ROUND`      | `{ lives }`                                                | Round skipped; remaining lives    |
| `NOTIFY_GAME_OVER`       | —                                                          | No lives remaining                |

### NBA All-Time Draft (`/draft`)

Multiplayer WebSocket game. One XState machine per room. Rooms are created via the `CREATE_ROOM` WebSocket event. The server generates a 5-character alphanumeric room ID.

**Socket namespace:** `/draft`

**Pool types:**

| Mode        | Description                                                                     |
| ----------- | ------------------------------------------------------------------------------- |
| `mvp`       | Every MVP-winning season. Picking a player invalidates their other MVP seasons. |
| `franchise` | One player per franchise. Picking removes both the player and franchise.        |
| `manual`    | Organizer hand-picks players (scaffolded, not yet implemented).                 |
| `nlq`       | Natural language query generates the pool (scaffolded, not yet implemented).    |

**Draft order:** `snake` or `linear`. Turn order is pre-expanded server-side into a flat `participantId[]` array.

## REST Endpoints

| Method | Path                      | Description                   |
| ------ | ------------------------- | ----------------------------- |
| POST   | `/api/careerpath/room`    | Create a new Career Path room |
| GET    | `/api/players`            | Search/list players           |
| GET    | `/api/players/:player_id` | Get a player by ID            |
| GET    | `/api/teams`              | List all teams                |
| GET    | `/api/teams/:team_id`     | Get a team by ID              |
| GET    | `/api/pools`              | List saved pools              |
| POST   | `/api/pools`              | Create a saved pool           |
| GET    | `/api/pools/:id`          | Get a pool by ID              |
| PATCH  | `/api/pools/:id`          | Update a pool                 |
| DELETE | `/api/pools/:id`          | Delete a pool                 |
| POST   | `/api/pools/preview`      | Preview a pool without saving |

## Naming Conventions

| Thing                 | Convention                | Example               |
| --------------------- | ------------------------- | --------------------- |
| Files                 | `feature.type.ts`         | `draft.service.ts`    |
| Classes               | PascalCase                | `DraftGateway`        |
| XState events         | SCREAMING_SNAKE_CASE      | `PARTICIPANT_JOINED`  |
| XState guards         | `is*` / `are*` prefix     | `areRoundsRemaining`  |
| XState assign actions | `assign*` prefix          | `assignConfig`        |
| XState notify actions | `notify*` prefix          | `notifyPickConfirmed` |
| XState states         | camelCase                 | `waitingForPlayers`   |
| Room IDs              | 5-char uppercase alphanum | `XYZ12`               |
| REST params           | snake_case                | `/players/:player_id` |
| WebSocket namespaces  | lowercase                 | `/draft`              |

## Path Aliases

`@/` resolves to `src/`:

```typescript
import { DraftService } from '@/nba/draft/draft.service';
```
