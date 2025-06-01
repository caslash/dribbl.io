# dribbl.io

This is a NBA career path guessing game. Guess the NBA player based on the presented career path. Play against friends in Multiplayer or simply test your ball knowledge in Single Player.

## Game Features

### Single Player Mode

- Progressive difficulty levels
- Score tracking (+1 point per correct answer)
- Lives system (-1 life per incorrect answer)
- Game ends when all lives are lost
- Option to restart with a new game
- Player statistics

### Multiplayer Mode

- Room-based gameplay
  - Host creates a room and receives a room code
  - Players join using the room code
  - Players can leave by navigating away
- Real-time gameplay
  - All players see the same team history
  - Round ends when:
    - A player correctly guesses the player
    - Round time limit is reached
  - After each round:
    - All acceptable answers are shown
    - New round automatically starts
- Live score updates
- Competitive gameplay

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `api`: a [NestJS](https://nestjs.com) app that provides:
  - NBA player data API
  - Real-time game functionality via WebSockets
  - PostgreSQL database integration
- `web`: a [Next.js](https://nextjs.org/) app that provides:
  - Interactive game interface
  - Real-time multiplayer functionality
  - Responsive design
- `@dribblio/database`: a Prisma ORM types library shared by both `web` and `api` applications
- `@dribblio/types`: a Typescript types library shared by both `web` and `api` applications
- `@dribblio/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@dribblio/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

## Development

### Prerequisites

- Node.js (Latest LTS version recommended)
- PostgreSQL database
- npm or yarn package manager

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/dribbl.io.git
   cd dribbl.io
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Create .env file in the api directory
   DATABASE_URL="postgresql://user:password@localhost:5432/dribblio"
   ```

### Build

To build all apps and packages, run the following command:

```bash
npm run build
```

### Develop

To develop all apps and packages, run the following command:

```bash
npm run dev
```

This will start:

- Next.js development server on port 3000
- NestJS development server on port 3001

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```bash
npx turbo login
npx turbo link
```

## License

Copyright (c) 2025 Cameron Slash. All Rights Reserved.

This software and associated documentation files (the "Software") are the proprietary property of Cameron Slash and are protected by copyright law. The Software is licensed, not sold.

You are not permitted to:

- Copy, modify, or create derivative works of the Software
- Reverse engineer, decompile, or disassemble the Software
- Remove or alter any proprietary notices or labels on the Software
- Use the Software for any commercial purpose
- Distribute, sublicense, or transfer the Software to any third party

Any unauthorized use, reproduction, or distribution of the Software is strictly prohibited and may result in severe legal consequences.

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)
