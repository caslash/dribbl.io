# @dribblio/web

Vite + React frontend for dribbl.io. Runs on port 3000. Proxies all `/api` requests to the API server at `localhost:3002`.

## Stack

- **React 19** — UI framework
- **React Router 7** — client-side routing
- **Vite** — build tool and dev server
- **Tailwind CSS 4** — utility-first styling
- **Socket.io client** — real-time WebSocket communication
- **React Hook Form** — form state management
- **Vitest + React Testing Library** — unit tests

## Getting Started

```bash
npm install
npm run dev
```

The dev server starts on port 3000. The API must be running on port 3002 for game features to work.

## Scripts

```bash
npm run dev         # Development server with HMR
npm run build       # Production build
npm run preview     # Preview the production build locally
npm test            # Run unit tests
npm run test:watch  # Unit tests in watch mode
npm run test:cov    # Unit tests with coverage
npm run check-types # Type-check only
npm run lint        # ESLint
```

## Source Structure

```
src/
├── main.tsx                 # Entry point
├── App.tsx                  # Root router setup
├── assets/                  # Static assets
├── components/              # Reusable UI components
│   ├── index.ts             # Barrel — re-exports all components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Badge.tsx
│   ├── PlayerSearchInput.tsx
│   ├── AppLayout.tsx
│   ├── career/              # Career Path game components
│   │   ├── CareerPathConfig.tsx
│   │   ├── TeamHistoryDisplay.tsx
│   │   ├── GuessArea.tsx
│   │   ├── ScoreBoard.tsx
│   │   ├── RoundFeedback.tsx
│   │   └── GameOverScreen.tsx
│   └── draft/               # Draft game components
│       ├── index.ts
│       ├── RoomEntrance.tsx
│       ├── DraftConfigPanel.tsx
│       ├── PoolPreview.tsx
│       ├── DraftBoard.tsx
│       ├── DraftResults.tsx
│       └── ...
├── pages/                   # Route-level components (one per route)
│   ├── HomePage.tsx
│   ├── CareerPathPage.tsx
│   ├── DraftLobbyPage.tsx
│   └── DraftRoomPage.tsx
├── hooks/                   # Custom React hooks
│   ├── index.ts             # Barrel — re-exports all hooks
│   ├── useCareerPath.ts
│   └── useDraft.ts
└── providers/               # React context providers
    ├── index.ts             # Barrel — re-exports all providers
    ├── CareerPathProvider.tsx
    └── DraftProvider.tsx
```

## Routing

All routes are defined in `src/App.tsx` using React Router's `BrowserRouter`.

| Path          | Page               | Description                        |
| ------------- | ------------------ | ---------------------------------- |
| `/`           | `HomePage`         | Landing page                       |
| `/career`     | `CareerPathPage`   | Career Path single-player game     |
| `/draft`      | `DraftLobbyPage`   | Draft lobby (create or join room)  |
| `/draft/:id`  | `DraftRoomPage`    | Active draft room                  |

## Imports

Use barrel exports and the `@/` path alias throughout the app:

```ts
import { Button, Card } from '@/components';
import { useCareerPath } from '@/hooks';
import { CareerPathProvider } from '@/providers';
```

Pages are imported directly in `App.tsx` — they are not re-exported from a barrel.

## API Proxy

In development, requests to `/api/*` are proxied to `http://localhost:3002`. You never need to hardcode the API base URL:

```ts
const res = await fetch('/api/players');
```

This is configured in `vite.config.ts`.

## Testing

Tests live under `test/`, mirroring the structure of `src/`. Test files use the `.spec.tsx` or `.spec.ts` extension.

```
test/
├── setup.ts
├── components/
├── hooks/
├── pages/
├── providers/
└── mocks/
    ├── components/   # Component mocks + barrel
    ├── hooks/        # Hook mocks + barrel
    └── providers/    # Provider mocks + barrel
```

Import mocks via their barrels:

```ts
import { MockButton } from '@/mocks/components';
import { mockUseCareerPath } from '@/mocks/hooks';
```

See `test/CLAUDE.md` for the full mocking conventions.
