import { CareerPathSocketEvent } from '@dribblio/types';
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
    socket.on('SAVE_CONFIG', (data) =>
      sendBack({ type: 'SAVE_CONFIG', ...data }),
    );
    socket.on('USER_GUESS', (data) =>
      sendBack({ type: 'USER_GUESS', ...data }),
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
