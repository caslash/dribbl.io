'use client';

import { io } from 'socket.io-client';

export const clientSocket = io(process.env.API_BASE_URL || 'http://localhost:3002', {
  autoConnect: false,
});
