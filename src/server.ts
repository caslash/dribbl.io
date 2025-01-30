import next from 'next';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { createActor, createMachine } from 'xstate';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

const gameMachine = createMachine(
  {
    initial: 'idle',
    states: {
      idle: {
        on: {
          CONNECT: 'gameActive',
        },
      },
      gameActive: {
        initial: 'waitForPlayers',
        states: {
          waitForPlayers: {
            entry: [
              {
                type: 'waitForPlayers',
              },
            ],
            on: {
              START: 'startingGame',
            },
          },
          startingGame: {
            invoke: {
              src: 'startGame',
              onDone: { target: 'generatingRound' },
            },
          },
          generatingRound: {
            invoke: {
              src: 'generateRound',
              onDone: { target: 'waitForGuess' },
            },
          },
          waitForGuess: {
            on: {
              CLIENT_GUESS: 'processingGuess',
            },
          },
          processingGuess: {
            always: [
              {
                guard: 'isCorrect',
                target: 'generatingRound',
              },
              { target: 'incorrectGuess' },
            ],
          },
          incorrectGuess: {
            invoke: {
              src: 'notifyIncorrectGuess',
              onDone: { target: 'waitForGuess' },
            },
          },
        },
      },
    },
  },
  {
    guards: {
      isCorrect: ({ context }) => {
        //Do something
        return true;
      },
    },
    actions: {
      waitForPlayers: (context, event) => {
        console.log('WAITING FOR PLAYERS');
      },
      startGame: (context, event) => {},
      generateRound: (context, event) => {},
      processGuess: (context, event) => {},
      notifyIncorrectGues: (context, event) => {},
    },
  },
);

app.prepare().then(() => {
  const gameActor = createActor(gameMachine);
  gameActor.start();
  const httpServer = createServer(handler);

  const io = new Server(httpServer);
  io.on('connection', (socket) => {
    gameActor.send({ type: 'CONNECT' });
    console.log(`Client connected on socket: ${socket}`);
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
