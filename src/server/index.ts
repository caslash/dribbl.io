import next from 'next';
import { createServer } from 'node:http';

import { createServerSocket } from '@/server/lib/serverSocket';
import { createSinglePlayerMachine } from '@/server/lib/singleplayer/statemachine';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const gameActor = createSinglePlayerMachine().start();
  createServerSocket(httpServer, gameActor);

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
