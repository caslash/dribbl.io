# Web App

A Vite + React application.

## Source Structure

All application code lives under `src/`. Organize it as follows:

```
src/
  components/       # Reusable React components
    index.ts        # Barrel file — re-exports all components
  pages/            # Route-level React components (one per route)
  hooks/            # Custom React hooks
    index.ts        # Barrel file — re-exports all hooks
  providers/        # React context providers
    index.ts        # Barrel file — re-exports all providers
```

### Components

Reusable UI components that are not tied to a specific route. Each component gets its own file inside `src/components/`. The barrel file `src/components/index.ts` must re-export every component so consumers import via the path alias:

```ts
import { Button, Card } from '@/components';
```

### Pages

Route-specific components. Each page maps to exactly one route and lives in `src/pages/`. Pages are **not** re-exported from a barrel — they are imported directly by the router.

## Routing

The app uses [React Router](https://reactrouter.com/). All route definitions live in `src/App.tsx`, using `BrowserRouter` to wrap `Routes`.

### Setup

```tsx
// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Router>
  );
}
```

### Conventions

- **One page per route.** Each `<Route>` maps to exactly one component in `src/pages/`.
- **Page naming.** Name page files and components with a `Page` suffix, e.g. `HomePage.tsx` exports `HomePage`.
- **No barrel for pages.** Import pages directly in `App.tsx` — do not add them to a barrel file.
- **Nested routes.** Use nested `<Route>` elements with an `<Outlet />` in a layout component when routes share a common shell (e.g. nav bar, sidebar). The layout component lives in `src/components/`, not `src/pages/`.

### Hooks

Custom React hooks live in `src/hooks/`. Re-export all hooks from `src/hooks/index.ts` so consumers import via:

```ts
import { useMyHook } from '@/hooks';
```

### Providers

React context providers live in `src/providers/`. Re-export all providers from `src/providers/index.ts` so consumers import via:

```ts
import { MyProvider } from '@/providers';
```

## API Proxy

The dev server runs on port `3000` and proxies all `/api` requests to the API server at `http://localhost:3001`. This means you never need to hardcode the API base URL or configure CORS in development — just make requests to `/api/*`:

```ts
const res = await fetch('/api/players')
```

This is configured in [vite.config.ts](vite.config.ts):

```ts
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true,
    },
  },
},
```

## Path Aliases

The `@/` alias resolves to `src/`. Configure it in both `vite.config.ts` and `tsconfig.json`.

## Testing

See [test/CLAUDE.md](test/CLAUDE.md) for the testing strategy and mocking conventions that depend on the barrel file structure above.
