# @dribblio/types

Shared TypeScript types for the dribbl.io monorepo. This is the single source of truth for types used by both the API (`apps/api`) and the web frontend (`apps/web`): TypeORM entities, XState context and event types, DTOs, and Socket.io event payloads.

## Usage

```ts
import { Player, Team, Season } from '@dribblio/types';
import { CareerPathContext, CareerPathInboundEvent } from '@dribblio/types';
import { CreatePoolDto } from '@dribblio/types';
```

## Source Structure

```
src/
├── index.ts                    # Barrel — re-exports everything
├── entities/
│   ├── player.entity.ts        # TypeORM Player entity
│   ├── team.entity.ts          # TypeORM Team entity
│   ├── season.entity.ts        # TypeORM Season stats entity
│   ├── accolade.entity.ts      # TypeORM Accolades/awards entity
│   ├── pool.entity.ts          # TypeORM Pool entity (saved draft pools)
│   ├── career-path-context.ts  # XState context type for Career Path
│   ├── draft-context.ts        # XState context type for Draft
│   ├── profile.ts              # User profile type
│   └── game-difficulty.ts      # Game difficulty enum
├── dtos/
│   ├── create-pool.dto.ts      # DTO for creating a pool
│   ├── update-pool.dto.ts      # DTO for updating a pool
│   ├── preview-pool.dto.ts     # DTO for previewing a pool
│   └── start-draft.dto.ts      # DTO for starting a draft
├── career-path-events/
│   ├── inbound.ts              # Client → Server events (Career Path)
│   └── outbound.ts             # Server → Client events (Career Path)
└── draft-events/
    ├── inbound.ts              # Client → Server events (Draft)
    └── outbound.ts             # Server → Client events (Draft)
```

## When to Add Types Here

Add types to this package when they are consumed by **both** the API and the frontend. Backend-only types (e.g., internal service interfaces, repository helpers) can stay local to `apps/api`. Frontend-only types can stay local to `apps/web`.

**Critical:** Never import TypeORM, NestJS decorators, or any other backend-coupled module into code that is consumed by the frontend or `apps/cli`. Use plain interface mirrors instead.

## Scripts

```bash
npm run build       # Compile TypeScript to dist/
npm run dev         # Watch mode
npm run typecheck   # Type-check only
```
