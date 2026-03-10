import { CareerPathSocketEvent } from '@dribblio/types';
import { Server, Socket } from 'socket.io';
import { fromCallback } from 'xstate';

export type SocketActorInput = {
  io: Server;
  roomId: string;
  initialSocket?: Socket;
};

export const socketActor = fromCallback<
  CareerPathSocketEvent,
  SocketActorInput
>(({ input, sendBack, receive }) => {
  const { io, roomId, initialSocket } = input;

  const registerListeners = (socket: Socket) => {
    socket.on('START_GAME', () => sendBack({ type: 'START_GAME' }));
    socket.on('SAVE_CONFIG', (data) =>
      sendBack({ type: 'SAVE_CONFIG', ...data }),
    );
    socket.on('USER_GUESS', (data) =>
      sendBack({ type: 'USER_GUESS', guess: data }),
    );
    socket.on('SKIP', () => sendBack({ type: 'SKIP' }));
    socket.on('disconnect', () => sendBack({ type: 'PLAYER_DISCONNECTED' }));
  };

  if (initialSocket) registerListeners(initialSocket);
  io.on('connection', registerListeners);

  receive((event) => io.to(roomId).emit(event.type, event));

  return () => {
    io.off('connection', registerListeners);
    io.to(roomId).disconnectSockets(true);
  };
});
