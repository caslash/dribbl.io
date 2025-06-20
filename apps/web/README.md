# Dribbl.io Web Application

A Next.js-based web application for Dribbl.io, providing an interactive interface for the CareerPath NBA player guessing game with secure user authentication.

## Architecture

The web application is built using Next.js 15 and follows a modern React architecture:

- **App Router**: Next.js App Router for routing and page organization
  - `/singleplayer`: Single player game mode
  - `/multiplayer`: Multiplayer game mode
  - `/profile`: User profile management (protected route)
  - `/auth/login`: Authentication login page
  - `/auth/logout`: Authentication logout page
- **Component Structure**:
  - `components/`: Reusable UI components
  - `hooks/`: Custom React hooks
  - `lib/`: Utility functions and shared logic
  - `styles/`: Global styles and Tailwind configuration
  - `config/`: Application configuration
  - `icons/`: SVG icons and assets
- **Authentication Integration**:
  - Auth0 Next.js SDK for authentication
  - Protected routes with middleware
  - User profile management
  - JWT token handling

## Tech Stack

- Next.js 15.x with App Router
- React 19.x
- TypeScript
- Tailwind CSS for styling
- Radix UI for accessible components
- Socket.IO Client for real-time communication
- Zod for schema validation
- React Hook Form for form handling
- **Auth0 Next.js SDK for authentication**
- **Next.js Middleware for route protection**

## Features

### Game Modes

1. **Single Player**

   - Progressive difficulty levels
   - Score tracking (+1 point per correct answer)
   - Lives system (-1 life per incorrect answer)
   - Game ends when all lives are lost
   - Option to restart with a new game
   - Player statistics

2. **Multiplayer**
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

- **Auth0 Integration**: Secure authentication with social login support
- **User Profiles**: Personalized user experience with profile management
- **Protected Routes**: Secure access to user-specific features
- **Profile Management**: View and update user profile information
- **Session Management**: Automatic session handling and token refresh
- **Social Login**: Support for Google and other social providers

### UI Components

The application uses a combination of:

- Radix UI primitives for accessibility
- Tailwind CSS for styling
- Responsive design for all screen sizes
- **Auth0 components for authentication flows**

## Development Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables (create `.env.local` file):

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

3. Configure Auth0 Application:

   - Create an Auth0 account at [auth0.com](https://auth0.com)
   - Create a new application (Regular Web Application)
   - Configure callback URLs: `http://localhost:3000/api/auth/callback`
   - Configure logout URLs: `http://localhost:3000`
   - Create an API with appropriate scopes
   - Update the environment variables with your Auth0 configuration

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Build for production:

   ```bash
   npm run build
   ```

6. Start production server:
   ```bash
   npm run start
   ```

## Available Scripts

- `npm run dev`: Start development server with Turbopack
- `npm run build`: Build the application
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run check-types`: Run TypeScript type checking

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── singleplayer/    # Single player game mode
│   ├── multiplayer/     # Multiplayer game mode
│   ├── profile/         # User profile management (protected)
│   ├── auth/            # Authentication routes
│   │   ├── login/       # Login page
│   │   └── logout/      # Logout page
│   ├── api/             # API routes
│   │   └── auth/        # Auth0 API routes
│   ├── layout.tsx       # Root layout
│   └── providers.tsx    # Global providers
├── components/          # Reusable UI components
│   ├── navbar/          # Navigation components
│   ├── ui/              # Base UI components
│   └── login-form.tsx   # Authentication form
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
│   └── auth0.ts        # Auth0 configuration
├── icons/              # SVG icons
├── config/             # App configuration
├── styles/             # Global styles
└── middleware.ts       # Next.js middleware for route protection
```

## Dependencies

### Core

- Next.js 15.x
- React 19.x
- TypeScript
- Tailwind CSS

### Authentication

- **@auth0/nextjs-auth0**: Auth0 Next.js SDK
- **Next.js Middleware**: Route protection

### UI Components

- Radix UI primitives
- Lucide React icons
- Tailwind Variants

### State Management & Data

- React Hook Form
- Zod for validation
- Socket.IO Client
- Canvas Confetti for effects

### Development

- ESLint
- TypeScript
- PostCSS
- Tailwind CSS

## Authentication Flow

1. **Login**: Users can log in via Auth0's universal login or social providers
2. **Session Management**: Automatic session handling with token refresh
3. **Protected Routes**: Middleware protects routes requiring authentication
4. **Profile Access**: Authenticated users can access their profile page
5. **API Integration**: JWT tokens are used for secure API communication
6. **Logout**: Secure logout with session cleanup

## Security Features

- **JWT Token Validation**: Secure token-based authentication
- **Route Protection**: Middleware-based route protection
- **Session Management**: Secure session handling
- **CORS Protection**: Configured for secure cross-origin requests
- **Input Validation**: Comprehensive form validation
- **Error Handling**: Secure error responses

## Future Enhancements

- **Enhanced User Profiles**: Additional user statistics and preferences
- **Leaderboards**: Global and friend-based leaderboards
- **Achievement System**: Gamification with achievements and badges
- **Social Features**: Friend system and social interactions
- **Advanced Analytics**: Detailed game statistics and insights
- **Progressive Web App**: Offline support and app-like experience
- **Theme Customization**: User-selectable themes and customization

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
