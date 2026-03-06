import { CareerPathSocketEvent, UserGuess } from '@dribblio/types';
import { Server, Socket } from 'socket.io';
import { fromCallback } from 'xstate';

export type SocketActorInput = {
  io: Server;
  roomId: string;
};

export const socketActor = fromCallback<
  CareerPathSocketEvent,
  SocketActorInput
>(({ input, sendBack, receive }) => {
  const { io, roomId } = input;

  io.on('connection', (socket: Socket) => {
    socket.on('START_GAME', () => sendBack({ type: 'START_GAME' }));
    socket.on('USER_GUESS', (guess: UserGuess) =>
      sendBack({ type: 'USER_GUESS', guess }),
    );
    socket.on('SKIP', () => sendBack({ type: 'SKIP' }));
    socket.on('PLAYER_DISCONNECTED', () =>
      sendBack({ type: 'PLAYER_DISCONNECTED' }),
    );
  });

  receive((event) => io.to(roomId).emit(event.type, event));

  return () => {
    io.to(roomId).disconnectSockets(true);
  };
});
