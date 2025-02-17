import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { Actor, AnyStateMachine } from 'xstate';

export const createServerSocket = (
  httpServer: HttpServer,
  gameActor: Actor<AnyStateMachine>,
): Server => {
  const io = new Server(httpServer);

  io.on('connection', (socket) => {
    console.log(`Client connected on socket ${socket.id}`);

    gameActor.subscribe((s) => {
      socket.emit('state_change', s.value);
    });

    gameActor.send({ type: 'CONNECT', socket });

    socket.on('start_game', () => gameActor.send({ type: 'START' }));

    socket.on('client_guess', (guess: string) => gameActor.send({ type: 'PLAYER_GUESS', guess }));

    socket.on('disconnect', () => {
      console.log(`Client disconnected from socket ${socket.id}`);
      gameActor.send({ type: 'DISCONNECT' });
    });
  });

  return io;
};
