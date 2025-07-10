'use client';

import { io } from 'socket.io-client';

const baseUrl = process.env.API_BASE_URL || 'http://localhost:3002';

export const singlePlayerSocket = io(baseUrl, {
  path: '/singleplayer',
  autoConnect: false,
});

export const multiplayerSocket = io(baseUrl, {
  path: '/multiplayer',
  autoConnect: false,
});
