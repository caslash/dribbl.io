# Dribbl.io API

A NestJS-based API service for Dribbl.io, providing NBA player data and real-time game functionality.

## Architecture

The API is built using NestJS and follows a modular architecture:

- `NBAModule`: Core module handling NBA-related features
  - `PlayersModule`: Manages NBA player data and statistics
  - `GamesModule`: Handles game-related functionality
    - `CareerPath`: Real-time game implementation using WebSockets
- `DatabaseModule`: Database integration using Prisma with PostgreSQL

## Tech Stack

- NestJS 11.x
- Socket.IO for real-time communication
- Prisma for database operations
- PostgreSQL database
- TypeScript
- Jest for testing

## Database Schema

The API uses a PostgreSQL database with the following main models:

### Player Model

```prisma
model Player {
  id                 Int               @id
  first_name         String?
  last_name          String?
  display_first_last String?
  display_fi_last    String?
  birthdate          DateTime?
  school             String?
  country            String?
  height             String?
  weight             String?
  season_exp         Int?
  jersey             String?
  position           String?
  team_history       String?
  is_active          Boolean?
  from_year          Int?
  to_year            Int?
  total_games_played Int?
  draft_round        String?
  draft_number       String?
  draft_year         String?
  player_accolades   player_accolades?
}
```

### Player Accolades Model

```prisma
model player_accolades {
  player_id Int    @id
  accolades Json?
  player    Player @relation(fields: [player_id], references: [id])
}
```

## API Endpoints

### Players API

Base URL: `/players`

| Method | Endpoint                   | Description            |
| ------ | -------------------------- | ---------------------- |
| GET    | `/`                        | Get all players        |
| GET    | `/random`                  | Get a random player    |
| GET    | `/count`                   | Get total player count |
| GET    | `/search?searchTerm=:term` | Search players by name |
| GET    | `/:id`                     | Get player by ID       |

## CareerPath Game

The CareerPath game is a real-time multiplayer/singleplayer game where players must identify NBA players based on their team history.

### Game Modes

1. **Single Player**

   - Players try to achieve the highest score possible
   - Limited number of lives
   - Progressive difficulty

2. **Multiplayer**
   - Real-time competition in game rooms
   - All players see the same team history
   - First correct answer gets a point
   - Real-time score updates

### Game Difficulties

1. **First Team All-NBA Players**

   - Only players who made All-NBA First Team
   - Players from 1980 onwards
   - Multiple team history required

2. **All-NBA Players**

   - Players who made any All-NBA team
   - Players from 1980 onwards
   - Multiple team history required

3. **Current Players**

   - Only active NBA players
   - Easier difficulty level

4. **All Players**
   - Complete NBA player database
   - Most challenging difficulty

## Development Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables:

   ```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/dribblio"
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Run tests:
   ```bash
   npm test
   ```

## Available Scripts

- `npm run build`: Build the application
- `npm run dev`: Start development server with hot reload
- `npm run start:prod`: Start production server
- `npm run test`: Run unit tests
- `npm run test:e2e`: Run end-to-end tests
- `npm run test:cov`: Generate test coverage report

## WebSocket Events

The CareerPath game uses WebSocket connections for real-time gameplay. The following events are supported:

- `join_room`: Join a game room
- `leave_room`: Leave a game room
- `start_game`: Start a new game
- `submit_answer`: Submit a player guess
- `game_state`: Receive game state updates
- `score_update`: Receive score updates

## Future Enhancements

- Authentication system for user management
- Persistent user profiles and statistics
- Additional game modes and difficulties
- Leaderboards and achievements
- Cloud deployment

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
