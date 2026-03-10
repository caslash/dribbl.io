# @dribblio/cli

Interactive terminal client for the **dribbl.io career path game**, written in TypeScript.

## Setup

```bash
npm install
```

## Usage

```bash
# Development (no build step)
npm run dev

# Build and run
npm run build
npm start

# Type-check only
npm run typecheck
```

## Environment

| Variable | Default | Description |
|---|---|---|
| `DRIBBL_API_URL` | `http://localhost:3002` | Base URL of the dribbl.io API |

```bash
DRIBBL_API_URL=https://your-api.com npm run dev
```

## Project structure

```
src/
  index.ts    — entrypoint, orchestrates setup and play-again loop
  game.ts     — core game loop (rounds, guesses, skip logic)
  prompts.ts  — typed inquirer wrappers for all user input
  socket.ts   — typed Socket.io connection and waitForEvent helper
  api.ts      — typed REST helpers (teams, player search)
  ui.ts       — rendering helpers (banner, round header, results)
  config.ts   — constants (URLs, difficulties, limits)
  types.ts    — local type mirrors of @dribblio/types (no backend deps)
```

## Monorepo integration

To add this as a Turborepo app, move the folder to `apps/cli` and add
`@dribblio/cli` to the root `turbo.json` pipeline.
