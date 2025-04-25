'use client';

import { io } from 'socket.io-client';

const URL = process.env.NODE_ENV === 'production' ? undefined : `http://localhost:3001`;

export const clientSocket = io(URL, {
  autoConnect: false,
});
