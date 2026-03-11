# dribbl.io — CLAUDE.md

NBA-themed multiplayer game platform. Turborepo monorepo with npm workspaces.

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

## Apps

### `apps/api`
NestJS backend. All game logic lives here as feature modules under `src/nba/`. Stateful game modes use XState v5 machines with Socket.io gateways. See [apps/api/CLAUDE.md](apps/api/CLAUDE.md).

### `apps/web`
Vite + React frontend. Source lives under `src/` organized into `components/`, `pages/`, `hooks/`, and `providers/`. See [apps/web/CLAUDE.md](apps/web/CLAUDE.md).

### `apps/db`
Python 3.10+ data pipeline. Scrapes `stats.nba.com` and writes player/team data into PostgreSQL. Entry point is `main.py`. See [apps/db/CLAUDE.md](apps/db/CLAUDE.md).

### `apps/cli`
TypeScript CLI for interacting with the API during development and testing.

## Packages

### `@dribblio/types`
The single source of truth for types shared between the API and web app — TypeORM entities, XState context/event types, DTOs, and Socket.io event payloads. When a type is needed by both frontend and backend, it goes here.

### `@dribblio/typescript-config`
Shared `tsconfig` base files extended by each app and package.

### `@dribblio/eslint-config`
Shared ESLint config extended by each app and package.

## Common Commands

```bash
npm run dev          # Start all apps in watch mode
npm run build        # Build all apps and packages
npm run test         # Run all tests
npm run lint         # Lint all packages
npm run check-types  # Type-check all packages
```

Run any command scoped to one app with Turborepo filters:

```bash
npx turbo run dev --filter=api
npx turbo run test --filter=web
```

## Code Style Rules

### Comments

Only comment code when the *why* isn't immediately obvious, or when the logic is genuinely complex. Never describe what the code does — if that needs explaining, rename or restructure instead.

```typescript
// Bad — restates what the code already says
// Find the first active player
const active = players.find(p => p.isActive);

// Good — explains a non-obvious "why"
// stats.nba.com ignores game_id_nullable — filter client-side instead
const filtered = results.filter(r => r.gameId === targetId);
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
