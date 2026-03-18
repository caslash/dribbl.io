# @dribblio/cli

Interactive terminal client for the dribbl.io **Career Path** game, written in TypeScript. Connects to the API over WebSocket for real-time gameplay and uses REST for team/player lookups.

## Setup

```bash
npm install
```

## Usage

```bash
# Development — run directly with tsx, no build step needed
npm run dev

# Build and run
npm run build
npm start

# Type-check only
npm run typecheck
```

## Environment Variables

| Variable        | Default                   | Description                  |
| --------------- | ------------------------- | ---------------------------- |
| `DRIBBL_API_URL`| `http://localhost:3002`   | Base URL of the dribbl.io API |

```bash
DRIBBL_API_URL=https://your-api.com npm run dev
```

## Source Structure

```
src/
├── index.ts    # Entry point — setup, play-again loop
├── game.ts     # Core game loop — rounds, guesses, skip logic
├── prompts.ts  # Typed inquirer wrappers for all user input
├── socket.ts   # Typed Socket.io connection and waitForEvent helper
├── api.ts      # Typed REST helpers — teams, player search
├── ui.ts       # Rendering helpers — banner, round header, results
├── config.ts   # Constants — URLs, difficulties, limits
└── types.ts    # Local type mirrors (no backend/TypeORM dependencies)
```

`types.ts` contains lightweight mirrors of `@dribblio/types` so the CLI never imports TypeORM or backend-coupled code.

## How It Works

1. `index.ts` creates a REST client and opens a Socket.io connection to `/careerpath`.
2. The server creates a room and returns a `roomId`.
3. `game.ts` drives the round loop: displays team history, prompts for a guess or skip, and handles server responses.
4. On game over, the user is offered a play-again option, which resets the session without reconnecting.
