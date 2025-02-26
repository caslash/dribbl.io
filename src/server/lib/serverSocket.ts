import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { createSinglePlayerMachine } from './singleplayer/statemachine';

export const createServerSocket = (httpServer: HttpServer): Server => {
  const io = new Server(httpServer);

  io.on('connection', (socket) => {
    console.log(`Client connected on socket ${socket.id}`);

    const gameActor = createSinglePlayerMachine().start();

    socket.on('start_game', () => {
      gameActor.subscribe((s) => {
        socket.emit('state_change', s.value);
      });

      socket.on('client_guess', (guessId: number) =>
        gameActor.send({ type: 'CLIENT_GUESS', guessId }),
      );

      socket.on('skip_round', () => gameActor.send({ type: 'SKIP' }));

      socket.on('disconnect', () => {
        console.log(`Client disconnected from socket ${socket.id}`);
        gameActor.stop();
      });

      gameActor.send({ type: 'START_GAME', socket });
    });
  });

  return io;
};
