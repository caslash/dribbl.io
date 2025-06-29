'use client';

import { io } from 'socket.io-client';

export const clientSocket = io(process.env.API_BASE_URL, {
  autoConnect: false,
});
