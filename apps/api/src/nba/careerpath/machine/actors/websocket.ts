import { CareerPathSocketEvent } from '@dribblio/types';
import { Server, Socket } from 'socket.io';
import { fromCallback } from 'xstate';

/**
 * Input provided to the CareerPath socket actor on creation.
 *
 * @example
 * const input: SocketActorInput = { io, roomId, initialSocket: socket };
 */
export type SocketActorInput = {
  /** The Socket.io server instance. */
  io: Server;
  /** The room ID this actor is scoped to. */
  roomId: string;
  /** The player's socket, provided by the gateway on room creation. */
  initialSocket?: Socket;
};

/**
 * XState callback actor that bridges a single player's Socket.io connection
 * to the CareerPath state machine.
 *
 * Listens for inbound socket events and forwards them to the machine via
 * `sendBack`. Outbound machine events are forwarded to the room via `receive`.
 * On cleanup, the room's sockets are force-disconnected.
 *
 * CareerPath is single-player — the `initialSocket` is always the only socket
 * this actor will ever communicate with. No global `io.on('connection')`
 * listener is registered.
 */
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

  receive((event) => io.to(roomId).emit(event.type, event));

  return () => {
    io.to(roomId).disconnectSockets(true);
  };
});
