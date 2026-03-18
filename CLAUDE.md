# dribbl.io — Project Reference for Claude Code

## What is dribbl.io?

dribbl.io is a multiplayer NBA-themed web application suite. It currently encompasses two game modes:

1. **Career Path Game** — A single-player guessing game where players identify an NBA player based on their career team history sequence.
2. **NBA All-Time Draft** — A multiplayer room-based drafting game where users take turns selecting all-time NBA players to build their dream team.

Both modes are backed by a shared NestJS API, a PostgreSQL database of NBA players/teams/seasons/accolades, and real-time WebSocket communication via Socket.io.

---

## Repository Structure

```
dribbl.io/
├── apps/
│   ├── api/      # NestJS REST + WebSocket API (port 3002)
│   ├── web/      # Vite + React frontend
│   ├── db/       # Python data pipeline (scrapes stats.nba.com → PostgreSQL)
│   └── cli/      # TypeScript CLI client for testing/dev
└── packages/
    ├── types/              # @dribblio/types — shared TypeScript types (entities, DTOs, events)
    ├── typescript-config/  # @dribblio/typescript-config — shared tsconfig bases
    └── eslint-config/      # @dribblio/eslint-config — shared ESLint config
```

Each app has its own `CLAUDE.md` with app-specific conventions. Read it before working in that app.

**Critical rule:** Never import TypeORM or NestJS-coupled types into `packages/` or `apps/cli`. Use lightweight interface mirrors instead.

---

## Code Style Rules

### Comments

Only comment code when the _why_ isn't immediately obvious, or when the logic is genuinely complex. Never describe what the code does — if that needs explaining, rename or restructure instead.

```typescript
// Bad — restates what the code already says
// Find the first active player
const active = players.find((p) => p.isActive);

// Good — explains a non-obvious "why"
// stats.nba.com ignores game_id_nullable — filter client-side instead
const filtered = results.filter((r) => r.gameId === targetId);
```

### JSDoc

Use JSDoc to document all exported functions, classes, and their parameters and fields. Include a usage example in the `@example` tag whenever the call signature isn't immediately obvious from the name and types alone.

```typescript
/**
 * Generates a unique room ID for a new game session.
 *
 * @returns A 5-character uppercase alphanumeric string.
 *
 * @example
 * const roomId = generateRoomId(); // e.g. "XYZ12"
 */
export function generateRoomId(): string { ... }

/**
 * Finds a player by their full name using a case-insensitive search.
 *
 * @param name - The player's full name to search for.
 * @param players - The pool of players to search within.
 * @returns The matching player, or `undefined` if not found.
 *
 * @example
 * const player = findPlayerByName('LeBron James', roster);
 */
export function findPlayerByName(name: string, players: Player[]): Player | undefined { ... }
```

For classes, document the class itself and each public field or constructor parameter:

```typescript
/**
 * Manages the lifecycle of active game rooms and their XState actors.
 *
 * @example
 * const service = new DraftService(playerService);
 * const roomId = service.createRoom(config);
 * service.getRoom(roomId)?.send({ type: 'PARTICIPANT_JOINED', ... });
 */
@Injectable()
export class DraftService { ... }
```

---

## Tech Stack

| Layer             | Technology                                                      |
| ----------------- | --------------------------------------------------------------- |
| Backend framework | NestJS                                                          |
| ORM               | TypeORM                                                         |
| Database          | PostgreSQL                                                      |
| Real-time         | Socket.io                                                       |
| State machines    | XState v5                                                       |
| Monorepo          | Turborepo                                                       |
| CLI client        | `tsx`, `socket.io-client`, `inquirer`, `chalk`, `ora`, `figlet` |

---

## Apps

### `apps/api`

NestJS backend. All game logic lives here as feature modules under `src/nba/`. Stateful game modes use XState v5 machines with Socket.io gateways. See [apps/api/CLAUDE.md](apps/api/CLAUDE.md).

### `apps/web`

Vite + React frontend. Source lives under `src/` organized into `components/`, `pages/`, `hooks/`, and `providers/`. See [apps/web/CLAUDE.md](apps/web/CLAUDE.md).

### `apps/db`

Python 3.10+ data pipeline. Scrapes `stats.nba.com` and writes player/team data into PostgreSQL. Entry point is `main.py`. See [apps/db/CLAUDE.md](apps/db/CLAUDE.md).

### `apps/cli`

TypeScript CLI for interacting with the API during development and testing.

---

## Packages

### `@dribblio/types`

The single source of truth for types shared between the API and web app — TypeORM entities, XState context/event types, DTOs, and Socket.io event payloads. When a type is needed by both frontend and backend, it goes here.

### `@dribblio/typescript-config`

Shared `tsconfig` base files extended by each app and package.

### `@dribblio/eslint-config`

Shared ESLint config extended by each app and package.

---

## Database

PostgreSQL with a `readonly` `api_user` for most tables. The `pools` table additionally grants `INSERT`, `UPDATE`, `DELETE` to `api_user`.

### Core Tables

- `players` — NBA player records
- `teams` — NBA team records (including historical franchises)
- `seasons` — Player season stats, one row per player per season per team
- `accolades` — Awards (MVP seasons, All-Star, etc.)
- `pools` — Saved draft pools created by users

### Key Data Rules (Career Path Game)

- Filter to **Regular Season** only; exclude `TOT` (trade-year aggregate) rows.
- Collapse consecutive same-team stints into a single entry.
- Group players with identical career sequences under a shared `historyKey` (`team1→team2→...`) — all are valid co-answers for the same round.
- Open edge cases: franchise relocations (Sonics/Thunder abbreviation mismatches), whether return stints are distinct, minimum season thresholds for playable players.

---

## Game Mode 1: Career Path Game

### Concept

The player is shown an ordered sequence of NBA team logos/abbreviations representing a player's career path. They must guess an NBA player that has had that exact team history.

### Backend Architecture

- **Transport:** Socket.io (single-player WebSocket session per room)
- **Room creation:** REST — `POST /careerpath/room` returns a `roomId`
- **State machine:** XState v5, one machine instance per room, managed by a NestJS service
- **Room cleanup:** Machine actor is stopped and removed from the Map when the machine reaches the `closed` final state

### XState Machine States

```
idle
  └─> waitingForGameStart  (after SAVE_CONFIG or direct connect)
        └─> gameActive       (after START_GAME)
              └─> closed      (final, after PLAYER_DISCONNECTED or game over)
```

### Socket Events — Client → Server

| Event                 | Payload                                 | Description                                                   |
| --------------------- | --------------------------------------- | ------------------------------------------------------------- |
| `SAVE_CONFIG`         | `{ config: { lives: number \| null } }` | Configure lives before starting. Omit/null for infinite mode. |
| `START_GAME`          | _(none)_                                | Begin the game                                                |
| `USER_GUESS`          | `{ guess: { guessId: number } }`        | Submit a player ID as the guess                               |
| `SKIP`                | _(none)_                                | Skip the current round                                        |
| `PLAYER_DISCONNECTED` | _(none)_                                | Graceful disconnect; triggers cleanup                         |

### Socket Events — Server → Client

| Event                    | Payload                                                    | Description                                                         |
| ------------------------ | ---------------------------------------------------------- | ------------------------------------------------------------------- |
| `NOTIFY_CONFIG_SAVED`    | `{ config }`                                               | Config acknowledged                                                 |
| `NOTIFY_NEXT_ROUND`      | `{ score, team_history: string[], lives: number \| null }` | New round; `team_history` is the ordered team abbreviation sequence |
| `NOTIFY_CORRECT_GUESS`   | `{ validAnswers }`                                         | Correct — includes all valid co-answers                             |
| `NOTIFY_INCORRECT_GUESS` | `{ lives }`                                                | Wrong guess; remaining lives                                        |
| `NOTIFY_SKIP_ROUND`      | `{ lives }`                                                | Round skipped; remaining lives                                      |
| `NOTIFY_GAME_OVER`       | _(none)_                                                   | No lives remaining                                                  |

### Game Logic

- A correct guess is any player whose `historyKey` matches the current round's target `historyKey`.
- A skip in lives mode costs 1 life. In infinite mode, score resets to 0.
- Score increments by 1 per correct guess and persists across rounds until game over.

---

## Game Mode 2: NBA All-Time Draft

### Concept

Users join or create a multiplayer WebSocket room. The room organizer configures a pool of NBA players and draft settings. Participants take turns selecting players from the pool to build their dream team. Once the draft is complete, shareable graphics of each participant's team (and draft order) can be generated.

### Backend Architecture

- **Transport:** Socket.io (multiplayer, room-scoped)
- **Room creation:** Via WebSocket (`CREATE_ROOM` event) — server returns a `roomId` generated by `short-unique-id`
- **State machine:** XState v5, one machine instance per room, managed by `DraftService`
- **Room cleanup:** Machine actor removed from the Map when machine reaches `closed` state

### XState Machine States (high-level)

```
lobby
  ├─> configuringPool     (organizer picks pool type and settings)
  ├─> previewingPool      (pool shown before draft starts)
  └─> draftActive
        ├─> turnInProgress  (current participant's pick window, with optional timer)
        ├─> updatingPool    (pool invalidation after pick)
        └─> checkingDraftEnd
  └─> results             (draft complete; shareable graphics generated)
  └─> closed              (final)
```

### Draft Modes

**MVP Mode** — Every player who has ever won MVP is in the pool. Each entry is a specific MVP season. When a player is picked, all of their other MVP seasons are invalidated from the pool.

**Franchise Mode** — One player per franchise. Picking a player removes both that player and that franchise from the pool. The same player on a different team is a distinct entry (e.g. LeBron-CLE vs LeBron-LAL).

**Future pool types (scaffolded via `PoolGenerator` strategy interface):**

- `manual` — organizer hand-picks players
- `nlq` — natural language query generates the pool

### Pool Architecture

All pool types implement a shared `PoolGenerator` interface:

```typescript
interface PoolGenerator {
  generate(config: RoomConfig): Promise<PoolEntry[]>;
}
```

Pool generation lives inside `DraftService`. The pool is previewed in the lobby and finalized on draft start.

### Saved Pools

- Users (organizers) can save a configured pool to the `pools` table.
- Pools have public/private visibility (creator chooses).
- A saved pool can be loaded into a new room and optionally modified before the draft starts.
- `createdBy` is currently stubbed as optional (auth not yet implemented).

### Draft Config (`RoomConfig`)

```typescript
type RoomConfig = {
  draftMode: 'mvp' | 'franchise' | 'manual' | 'nlq';
  draftOrder: 'snake' | 'linear';
  maxRounds: number; // always required, set by organizer
};
```

### Turn Order

- Pre-expanded `turnOrder` array is computed server-side by `DraftService` at draft start.
- Snake and linear expansion both produce a flat `participantId[]` array.
- `currentTurnIndex` into that array is the source of truth for whose turn it is.
- `always` transitions (not client events) handle turn advancement and end-of-draft detection.

### Socket Event Naming Convention

- **Inbound** (client → server): plain names — `SAVE_CONFIG`, `MAKE_PICK`, `START_DRAFT`, etc.
- **Outbound** (server → client): `NOTIFY_` prefix — `NOTIFY_TURN_ADVANCED`, `NOTIFY_ACTION_CONFIRMED`, `NOTIFY_COMPLETE`, etc.

### Shareable Graphics

At draft completion, the server (or client) generates shareable images:

- One graphic showing the full draft order / pick history
- One graphic per participant showing their resulting team

---

## XState v5 + NestJS Patterns

See `/mnt/skills/user/xstate-nestjs/SKILL.md` for the full skill reference. Key rules:

- Always use `setup()` before `createMachine()` — this is where actions, guards, and actors are typed and registered.
- The `socketActor` is invoked at the machine root and persists for the full session lifetime.
- Per-turn `timerActor` (via `fromCallback`) is invoked inside the relevant state — XState's automatic cleanup on transition handles cancellation.
- Use `assertEvent(event, ['EVENT_A', 'EVENT_B'])` for multi-event actions.
- The fifth generic on `sendTo` constrains the parent machine's event union, not the target actor — target type safety is enforced via the `SocketRef` generic.
- Define a typed `draftAssign` helper once and reuse it throughout the machine.
- `always` transitions with guards replace client-emitted threshold events (e.g. min players met, draft end check).
- Sets are not JSON-serializable — always send `string[]` on outbound socket events even if stored as `Set<string>` in context.
- Timer durations are always in **milliseconds**.

---

## CLI Client (`@dribblio/cli`)

A terminal client for testing and playing the Career Path game. Located at `apps/cli`.

- Written in TypeScript, run with `tsx` in dev.
- Uses `NodeNext` module resolution; passes `tsc --noEmit` cleanly.
- Decomposed into 8 typed modules: `types.ts`, `config.ts`, `api.ts`, `socket.ts`, `prompts.ts`, `ui.ts`, `game.ts`, `index.ts`.
- Never import TypeORM or backend-coupled types here.

---

## Development Principles

- **Server-authoritative:** The server is the single source of truth for all game state. Clients are thin consumers.
- **Modular decomposition:** Prefer multiple focused files over monolithic ones.
- **Strategy pattern for extensibility:** Pool generators, and similar extension points, implement a shared interface.
- **Consolidate related logic:** Keep turn order computation in `DraftService`, not spread across gateway/machine.
- **Least-privilege DB access:** `api_user` has write access only to `pools`; all other tables are read-only.

---

## Open / Upcoming Work

- Resolve career path edge cases: franchise relocations (Sonics ↔ Thunder), return stints, minimum season thresholds.
- Authentication integration (currently stubbed with optional `createdBy` on pools).
- Manual pool type and NLQ pool type implementations.
- Public/private visibility UI for saved pools.
- Frontend (web client) — not yet started.
