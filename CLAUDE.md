# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Root Level Commands (using Turborepo)
- `npm run dev` - Start all development servers (Next.js on port 3000, NestJS on port 3002)
- `npm run build` - Build all apps and packages
- `npm run lint` - Run linting across all workspaces
- `npm run test` - Run linting and tests
- `npm run check-types` - Type check all TypeScript files
- `npm run format` - Format code with Prettier
- `npm run db:generate` - Generate Prisma clients for both databases
- `npm run db:migrate` - Run database migrations

### Individual App Commands
- **API (NestJS)**: `npm run dev` in `/apps/api` directory
- **Web (Next.js)**: `npm run dev` in `/apps/web` directory  
- **Database CLI**: Swift executable in `/apps/db/nba_db` for NBA data population

## Architecture Overview

### Monorepo Structure
This is a Turborepo monorepo with three main applications:

1. **`apps/api`** - NestJS backend API
   - Authentication via Auth0 JWT
   - WebSocket gateways for real-time multiplayer gameplay
   - PostgreSQL database integration with dual Prisma clients
   - AWS S3 integration for avatar uploads with CloudFront signed URLs
   - Modular architecture: auth, database, NBA game logic, users

2. **`apps/web`** - Next.js frontend
   - Auth0 authentication integration with protected routes
   - Real-time WebSocket connections for multiplayer games
   - Responsive UI with Tailwind CSS and Radix UI components
   - Avatar editing with image cropping and drag-and-drop uploads

3. **`apps/db/nba_db`** - Swift CLI tool for NBA data management
   - Swift Package with NBAKit framework
   - API service for fetching NBA player data
   - Database service for populating PostgreSQL with player information
   - Comprehensive test suite with mock services

### Shared Packages
- **`@dribblio/database`** - Prisma ORM integration with dual database clients (NBA data + user data)
- **`@dribblio/types`** - Shared TypeScript types for WebSocket communication and API responses
- **`@dribblio/eslint-config`** - ESLint configuration
- **`@dribblio/typescript-config`** - TypeScript configurations

### Database Architecture
The system uses **dual PostgreSQL databases**:
- **NBA Database**: Player data, team information, career paths
- **Users Database**: Authentication, user profiles, avatars, game statistics

Both databases use separate Prisma clients generated from schemas in `/packages/database/prisma-nba/` and `/packages/database/prisma-users/`.

### Authentication & Authorization
- **Auth0** integration for secure user authentication
- **JWT tokens** for API authorization with permission-based guards
- **Protected routes** in Next.js using Auth0 middleware
- **S3 + CloudFront** for secure avatar storage and signed URL access

### Real-time Communication
- **WebSocket gateways** in NestJS for multiplayer game rooms
- **Socket.io** client integration in Next.js for real-time UI updates
- **Room-based gameplay** with host/join mechanics and live scoring

## Code Style & Standards

### TypeScript Best Practices
- Use interfaces over types for object definitions
- Prefer explicit return types for public functions
- Leverage TypeScript strict mode configuration
- Use meaningful names with auxiliary verbs (isLoading, hasError)

### Clean Code Guidelines
- Replace magic numbers with named constants
- Single responsibility functions
- Extract repeated code into reusable functions
- Use descriptive variable and function names that reveal purpose

### Framework-Specific Patterns
- **NestJS**: Use modules for feature organization, dependency injection, and proper decorator usage
- **Next.js**: Leverage App Router, server components, and proper middleware for authentication
- **Swift**: Follow Swift naming conventions and use protocols for service abstractions

## Testing
- **API**: Jest with supertest for e2e testing
- **Web**: Jest with React Testing Library (configuration in place)
- **Swift**: XCTest framework with comprehensive mock services
- Run `npm run test` at root level to execute all tests

## Environment Setup
Requires Auth0 application setup and AWS S3/CloudFront configuration. See README.md for detailed environment variable configuration for both development and production deployments.