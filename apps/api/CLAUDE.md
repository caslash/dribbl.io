# API App — CLAUDE.md

NestJS REST + WebSocket API for dribbl.io. Runs on port 3002. All routes prefixed with `/api`.

## Stack

- **NestJS** — framework (modules, DI, controllers, gateways)
- **TypeORM** — PostgreSQL ORM (entities imported from `@dribblio/types`)
- **XState v5** — state machines for stateful game modes
- **Socket.io** — real-time WebSocket communication via NestJS gateways
- **Vitest** — unit and E2E tests

## Directory Structure

```
src/
├── main.ts               # Bootstrap: ValidationPipe, /api prefix, port 3002
├── app.module.ts         # Root module: TypeORM config, imports NbaModule
└── nba/                  # All game/domain logic lives here
    ├── nba.module.ts
    ├── draft/            # Draft game mode (WebSocket + XState)
    ├── careerpath/       # Career Path game mode (WebSocket + XState)
    ├── pool/             # Pool management (REST)
    ├── player/           # Player data (REST)
    └── team/             # Team data (REST)
```

## Module Conventions

Each feature module follows this structure:

```
feature/
├── feature.module.ts
├── feature.service.ts
├── feature.controller.ts     # REST only
├── feature.gateway.ts        # WebSocket only
├── feature.*.spec.ts         # Tests co-located with source
└── machine/                  # XState machine (stateful modes only)
    ├── statemachine.ts       # Machine definition + createActor call
    ├── statemachine.spec.ts  # State machine tests
    ├── guards.ts
    └── actions/
        ├── assigns.ts        # Context mutation actions
        └── notifies.ts       # Socket.io emit actions
    └── actors/
        ├── websocket.ts      # Bidirectional Socket.io actor
        └── timer.ts          # Turn timer actor
```

## Types

- `@dribblio/types` is the shared package for types used by **both frontend and backend** (entities, context, events, DTOs).
- Backend-only types (e.g., internal service interfaces) can live in the module where they're used.
- When adding context/event types for a new game mode, put them in `@dribblio/types` if the frontend will consume them; otherwise keep them local.

## Database

- TypeORM with PostgreSQL. `synchronize: false`, `migrationsRun: false`.
- Entities are defined in `@dribblio/types` (shared package), not in this app.
- Inject repositories with `@InjectRepository(Entity)` and `Repository<Entity>`.
- Register entities per module with `TypeOrmModule.forFeature([...])`.
- Use `find()`/`findOne()` for simple queries; `createQueryBuilder()` for joins/complex filters.

## WebSocket Gateway Pattern

Gateways use a single wildcard listener and delegate all events to the XState machine via the service:

```typescript
@WebSocketGateway({ namespace: '/feature' })
export class FeatureGateway implements OnGatewayConnection {
  @WebSocketServer() io: Server;

  handleConnection(socket: Socket) {
    // Join existing room via ?roomId query param, or create a new one
  }

  @SubscribeMessage('*')
  handleMessage(@ConnectedSocket() socket: Socket, @MessageBody() data: Event) {
    const room = this.featureService.getRoom(socket.data.roomId);
    room?.send(data);
  }
}
```

- Rooms are identified by a 5-character alphanumeric ID (ShortUniqueId).
- Services maintain a `Map<roomId, Actor>` of running machines.
- Rooms are cleaned up when the machine reaches its final state.

## XState Machine Pattern

See the `nestjs-xstate` skill for full typing patterns — use it whenever creating or modifying a machine.

Key conventions:
- `createFeatureMachine(socketInfo)` returns a started `Actor` instance.
- Machine is defined with `setup({ types, actions, guards, actors }).createMachine(...)`.
- Context and event types come from `@dribblio/types`.
- **Assign actions** (`assigns.ts`): each game mode must define its own typed `assign` wrapper (e.g., `draftAssign`, `careerpathAssign`) that binds the machine's context and event types. Use this wrapper instead of raw `assign` throughout the machine.
- **Notify actions** (`notifies.ts`): use `sendTo('socket', ...)` to emit events to the Socket.io actor.
- **Guards** (`guards.ts`): pure predicate functions, named with `is*` or `are*` prefix.
- **Actors**: `socketActor` (bidirectional Socket.io), `timerActor` (turn timer), and invoked service actors for async work (e.g., round generation).

## Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Files | `feature.type.ts` | `draft.service.ts` |
| Classes | PascalCase | `DraftGateway` |
| XState events | SCREAMING_SNAKE_CASE | `PARTICIPANT_JOINED` |
| XState guards | predicate (`is*`/`are*`) | `areRoundsRemaining` |
| XState assign actions | `assign*` prefix | `assignConfig` |
| XState notify actions | `notify*` prefix | `notifyPickConfirmed` |
| XState states | camelCase | `waitingForPlayers` |
| Room IDs | 5-char uppercase alphanumeric | `XYZ12` |
| REST params | snake_case | `/players/:player_id` |
| WebSocket namespaces | lowercase | `/draft` |

## TypeScript Path Aliases

Use `@/` to reference `src/`:

```typescript
import { DraftService } from '@/nba/draft/draft.service';
```

## Testing

- Framework: **Vitest** with globals enabled (no need to import `describe`, `it`, `expect`).
- Unit tests: co-located with source as `*.spec.ts`.
- E2E tests: separate config (`vitest.config.e2e.ts`).
- Use `@nestjs/testing` `TestingModule` for DI in service/controller/gateway tests.
- Mock XState actors in machine tests by replacing them with `fromCallback` stubs that expose `sendBack`/`received` state.
- Use factory helpers (e.g., `makeParticipant`, `makeConfig`) to reduce test setup boilerplate.

### Running Tests

```bash
npm test           # Run unit tests once
npm run test:watch     # Watch mode
npm run test:cov       # With coverage
npm run test:e2e       # E2E tests
```

## Authentication

Auth is not yet implemented — all endpoints and WebSocket namespaces are currently public. This is planned for a future iteration; do not design new features to depend on auth being absent.

## Adding a New Game Mode

1. Create `src/nba/<mode>/` with `module`, `service`, `gateway`, and `machine/` following existing patterns.
2. Import the new module in `nba.module.ts`.
3. Define context/event types in `@dribblio/types` if the frontend needs them; backend-only types can stay local.
4. Use the `nestjs-xstate` skill when writing the machine — the typing patterns are easy to get wrong.

## Environment Variables

| Variable | Purpose |
|---|---|
| `PG_HOST` | PostgreSQL host |
| `PG_PORT` | PostgreSQL port |
| `PG_NBA_USERNAME` | DB username |
| `PG_NBA_PASSWORD` | DB password |
| `PG_NBA_DATABASE` | DB name |
| `PORT` | Server port (default `3002`) |
