'use client';

import { io } from 'socket.io-client';

export const clientSocket = io(`http://localhost:3002`, {
  autoConnect: false,
});
