import next from 'next';
import { createServer } from 'node:http';

import { createServerSocket } from '@/server/lib/serverSocket';
import { gameActor } from '@/server/lib/statemachine';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = createServerSocket(httpServer);
  gameActor.start();

  io.on('connection', (socket) => {
    console.log(`Client connected on socket ${socket.id}`);

    gameActor.subscribe((s) => {
      socket.emit('state_change', s.value);
    });

    gameActor.send({ type: 'CONNECT', socket: socket });

    socket.on('start_game', () => gameActor.send({ type: 'START' }));
    socket.on('disconnect', () => {
      console.log(`Client disconnected from socket ${socket.id}`);
      gameActor.send({ type: 'DISCONNECT' });
    });
  });

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
