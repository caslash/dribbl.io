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

### Authentication & User Management

- **Auth0 Integration**: Secure user authentication and authorization
- **User Profiles**: Personalized user experience with profile management
- **Protected Routes**: Secure access to user-specific features
- **Social Login**: Support for Google and other social providers
- **JWT Tokens**: Secure API access with JWT-based authentication
- **Avatar Management**: Upload and crop profile pictures with secure S3 storage
- **Profile Editing**: Update display name and profile information

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `api`: a [NestJS](https://nestjs.com) app that provides:
  - NBA player data API
  - Real-time game functionality via WebSockets
  - PostgreSQL database integration
  - **Auth0 JWT authentication and authorization**
  - **User management and profile endpoints**
  - **AWS S3 integration for avatar uploads**
  - **CloudFront signed URLs for secure avatar access**
- `web`: a [Next.js](https://nextjs.org/) app that provides:
  - Interactive game interface
  - Real-time multiplayer functionality
  - Responsive design
  - **Auth0 authentication integration**
  - **User profile management**
  - **Protected routes and middleware**
  - **Avatar editor with image cropping**
  - **Drag-and-drop file uploads**
- `@dribblio/database`: a Prisma ORM types library shared by both `web` and `api` applications
  - **NBA database schema** for player data
  - **Users database schema** for authentication and user profiles
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
- **Auth0 account and application setup**
- **AWS account with S3 and CloudFront setup**

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

   **API Environment Variables** (create `.env` file in the `api` directory):

   ```bash
   # Database URLs
   DATABASE_URL="postgresql://user:password@localhost:5432/dribblio"
   USERS_DATABASE_URL="postgresql://user:password@localhost:5432/dribblio_users"

   # Auth0 Configuration
   AUTH0_DOMAIN="your-domain.auth0.com"
   AUTH0_AUDIENCE="your-api-identifier"
   AUTH0_CLIENT_ID="your-client-id"
   AUTH0_CLIENT_SECRET="your-client-secret"
   AUTH0_SECRET="your-secret"
   AUTH0_SCOPE="openid profile email"

   # AWS Configuration
   AWS_S3_BUCKET_NAME="your-s3-bucket-name"
   AWS_CLOUDFRONT_CNAME="your-cloudfront-domain.cloudfront.net"
   AWS_CLOUDFRONT_KEY_PAIR_ID="your-cloudfront-key-pair-id"
   AWS_CLOUDFRONT_PRIVATE_KEY_SECRET_NAME="your-secrets-manager-secret-name"

   # Server Configuration
   PORT=3002
   ```

   **Web Environment Variables** (create `.env.local` file in the `web` directory):

   ```bash
   # Auth0 Configuration
   AUTH0_SECRET="your-secret"
   AUTH0_BASE_URL="http://localhost:3000"
   AUTH0_ISSUER_BASE_URL="https://your-domain.auth0.com"
   AUTH0_CLIENT_ID="your-client-id"
   AUTH0_CLIENT_SECRET="your-client-secret"
   AUTH0_AUDIENCE="your-api-identifier"
   AUTH0_SCOPE="openid profile email"
   ```

4. **Set up Auth0 Application**:

   - Create an Auth0 account at [auth0.com](https://auth0.com)
   - Create a new application (Regular Web Application)
   - Configure callback URLs: `http://localhost:3000/api/auth/callback`
   - Configure logout URLs: `http://localhost:3000`
   - Create an API with appropriate scopes
   - Update the environment variables with your Auth0 configuration

5. **Set up AWS Services**:

   - Create an S3 bucket for avatar storage
   - Set up CloudFront distribution for secure avatar access
   - Create a CloudFront key pair for signed URLs
   - Store the private key in AWS Secrets Manager
   - Configure CORS on your S3 bucket
   - Update the environment variables with your AWS configuration

6. **Set up Databases**:

   ```bash
   # Generate Prisma clients
   npm run db:generate

   # Run database migrations
   npm run db:migrate
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
- NestJS development server on port 3002

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
