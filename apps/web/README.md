# Dribbl.io Web Application

A Next.js-based web application for Dribbl.io, providing an interactive interface for the CareerPath NBA player guessing game.

## Architecture

The web application is built using Next.js 15 and follows a modern React architecture:

- **App Router**: Next.js App Router for routing and page organization
  - `/singleplayer`: Single player game mode
  - `/multiplayer`: Multiplayer game mode
- **Component Structure**:
  - `components/`: Reusable UI components
  - `hooks/`: Custom React hooks
  - `lib/`: Utility functions and shared logic
  - `styles/`: Global styles and Tailwind configuration
  - `config/`: Application configuration
  - `icons/`: SVG icons and assets

## Tech Stack

- Next.js 15.x with App Router
- React 19.x
- TypeScript
- Tailwind CSS for styling
- Radix UI for accessible components
- Socket.IO Client for real-time communication
- Zod for schema validation
- React Hook Form for form handling

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

### UI Components

The application uses a combination of:

- Radix UI primitives for accessibility
- Tailwind CSS for styling
- Responsive design for all screen sizes

## Development Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Build for production:

   ```bash
   npm run build
   ```

4. Start production server:
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
│   ├── layout.tsx       # Root layout
│   └── providers.tsx    # Global providers
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── icons/              # SVG icons
├── config/             # App configuration
└── styles/             # Global styles
```

## Dependencies

### Core

- Next.js 15.x
- React 19.x
- TypeScript
- Tailwind CSS

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

## Future Enhancements

- User authentication system (planned)
- Persistent user profiles
- Leaderboards
- Achievement system
- Additional game modes
- Enhanced animations and effects

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
