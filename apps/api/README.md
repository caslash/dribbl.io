# Dribbl.io API

A NestJS-based API service for Dribbl.io, providing NBA player data, real-time game functionality, and user authentication.

## Architecture

The API is built using NestJS and follows a modular architecture:

- `NBAModule`: Core module handling NBA-related features
  - `PlayersModule`: Manages NBA player data and statistics
  - `GamesModule`: Handles game-related functionality
    - `CareerPath`: Real-time game implementation using WebSockets
- `AuthModule`: Authentication and authorization using Auth0
  - `JwtStrategy`: JWT token validation and user authentication
- `UsersModule`: User management and profile functionality
  - `UsersController`: User profile endpoints
  - `UsersService`: User data management
  - `AvatarService`: Avatar upload and signed URL generation
  - `S3Service`: AWS S3 file upload functionality
  - `SignedUrlInterceptor`: Automatic signed URL generation for user profiles
- `DatabaseModule`: Database integration using Prisma with PostgreSQL
  - NBA database for player data
  - Users database for authentication and user profiles

## Tech Stack

- NestJS 11.x
- Socket.IO for real-time communication
- Prisma for database operations
- PostgreSQL database
- TypeScript
- Jest for testing
- **Auth0 for authentication and authorization**
- **Passport.js for JWT strategy**
- **JWKS-RSA for token validation**
- **AWS SDK for S3 and CloudFront integration**
- **AWS Secrets Manager for secure key storage**

## Database Schema

The API uses PostgreSQL databases with the following main models:

### NBA Database

#### Player Model

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

#### Player Accolades Model

```prisma
model player_accolades {
  player_id Int    @id
  accolades Json?
  player    Player @relation(fields: [player_id], references: [id])
}
```

### Users Database

#### User Model

```prisma
model User {
  id String @id
  display_name String?
  name String?
  profile_url String?
}
```

## Authentication

The API implements secure authentication using Auth0:

### JWT Strategy

- **Token Validation**: Validates JWT tokens using Auth0's JWKS endpoint
- **User Creation**: Automatically creates user profiles on first authentication
- **Profile Sync**: Fetches user profile information from Auth0
- **Protected Routes**: Uses `@UseGuards(AuthGuard('jwt'))` decorator

### Environment Variables

Required Auth0 configuration:

```bash
AUTH0_DOMAIN="your-domain.auth0.com"
AUTH0_AUDIENCE="your-api-identifier"
AUTH0_CLIENT_ID="your-client-id"
AUTH0_CLIENT_SECRET="your-client-secret"
AUTH0_SECRET="your-secret"
AUTH0_SCOPE="openid profile email"
```

## Avatar Management

The API provides comprehensive avatar management functionality:

### AWS S3 Integration

- **Secure File Upload**: Upload avatar images to S3 with proper file validation
- **Automatic File Naming**: Unique file names based on user ID and timestamp
- **CloudFront Distribution**: Serve avatars through CloudFront for better performance
- **Signed URLs**: Generate time-limited signed URLs for secure avatar access

### Avatar Service Features

- **Image Upload**: Handle multipart form data for avatar uploads
- **File Validation**: Validate file types and sizes
- **Secure Storage**: Store avatars in S3 with proper access controls
- **Signed URL Generation**: Create time-limited signed URLs for secure access
- **Automatic URL Signing**: Interceptor automatically signs profile URLs in responses

### Required AWS Environment Variables

```bash
AWS_S3_BUCKET_NAME="your-s3-bucket-name"
AWS_CLOUDFRONT_CNAME="your-cloudfront-domain.cloudfront.net"
AWS_CLOUDFRONT_KEY_PAIR_ID="your-cloudfront-key-pair-id"
AWS_CLOUDFRONT_PRIVATE_KEY_SECRET_NAME="your-secrets-manager-secret-name"
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

### Users API

Base URL: `/me` (Protected routes requiring authentication)

| Method | Endpoint  | Description                 |
| ------ | --------- | --------------------------- |
| GET    | `/`       | Get current user profile    |
| PATCH  | `/`       | Update current user profile |
| PUT    | `/avatar` | Upload user avatar image    |

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

3. Set up AWS services:

   - Create an S3 bucket for avatar storage
   - Set up CloudFront distribution for secure avatar access
   - Create a CloudFront key pair for signed URLs
   - Store the private key in AWS Secrets Manager
   - Configure CORS on your S3 bucket

4. Set up databases:

   ```bash
   # Generate Prisma clients
   npm run db:generate

   # Run database migrations
   npm run db:migrate
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Run tests:
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
- `npm run db:generate`: Generate Prisma clients
- `npm run db:migrate`: Run database migrations

## WebSocket Events

The CareerPath game uses WebSocket connections for real-time gameplay. The following events are supported:

- `join_room`: Join a game room
- `leave_room`: Leave a game room
- `start_game`: Start a new game
- `submit_answer`: Submit a player guess
- `game_state`: Receive game state updates
- `score_update`: Receive score updates

## Dependencies

### Core Dependencies

- `@nestjs/common`: NestJS core framework
- `@nestjs/core`: NestJS core functionality
- `@nestjs/platform-express`: Express platform integration
- `@nestjs/platform-socket.io`: Socket.IO platform integration
- `@nestjs/websockets`: WebSocket support
- `@nestjs/passport`: Passport integration
- `passport-jwt`: JWT strategy for Passport
- `jwks-rsa`: JWKS RSA key retrieval

### AWS Dependencies

- `@aws-sdk/client-s3`: S3 client for file uploads
- `@aws-sdk/client-secrets-manager`: Secrets Manager client
- `@aws-sdk/cloudfront-signer`: CloudFront signed URL generation
- `@aws-sdk/lib-storage`: S3 upload utilities

### Database & Validation

- `@dribblio/database`: Shared database package
- `class-validator`: Request validation
- `class-transformer`: Object transformation
- `rxjs`: Reactive programming utilities

## Security Features

- **JWT Token Validation**: Secure token-based authentication
- **CORS Protection**: Configured for secure cross-origin requests
- **Rate Limiting**: Built-in protection against abuse
- **Input Validation**: Comprehensive request validation using class-validator
- **Error Handling**: Secure error responses without sensitive information
- **Signed URLs**: Time-limited secure access to avatar images
- **AWS IAM**: Proper access controls for S3 and CloudFront

## Future Enhancements

- **Enhanced User Profiles**: Additional user statistics and preferences
- **Leaderboards**: Global and friend-based leaderboards
- **Achievement System**: Gamification with achievements and badges
- **Social Features**: Friend system and social interactions
- **Advanced Analytics**: Detailed game statistics and insights
- **Cloud Deployment**: Production-ready deployment configuration
- **Image Processing**: Server-side image optimization and resizing
- **CDN Integration**: Enhanced content delivery network setup

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
