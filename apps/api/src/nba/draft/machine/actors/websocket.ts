import { DraftSocketActorEvent } from '@dribblio/types';
import { Server, Socket } from 'socket.io';
import { fromCallback } from 'xstate';

export type SocketActorInput = {
  io: Server;
  roomId: string;
};

export const socketActor = fromCallback<
  DraftSocketActorEvent,
  SocketActorInput
>(({ input, sendBack, receive }) => {
  const { io, roomId } = input;

  io.on('connection', (socket: Socket) => {
    if (!socket.rooms.has(roomId)) return;

    socket.on('PARTICIPANT_JOINED', (data) => {
      if (!data || typeof data !== 'object') return;
      sendBack({ type: 'PARTICIPANT_JOINED', ...data });
    });
    socket.on('PARTICIPANT_LEFT', (data) => {
      if (!data || typeof data !== 'object') return;
      sendBack({ type: 'PARTICIPANT_LEFT', ...data });
    });
    socket.on('ORGANIZER_CONFIGURE', () =>
      sendBack({ type: 'ORGANIZER_CONFIGURE' }),
    );
    socket.on('ORGANIZER_CANCEL_DRAFT', () =>
      sendBack({ type: 'ORGANIZER_CANCEL_DRAFT' }),
    );
    socket.on('PARTICIPANT_RECONNECTED', (data) => {
      if (!data || typeof data !== 'object') return;
      sendBack({ type: 'PARTICIPANT_RECONNECTED', ...data });
    });
    socket.on('AUTO_PICK_RESOLVED', (data) => {
      if (!data || typeof data !== 'object') return;
      sendBack({ type: 'AUTO_PICK_RESOLVED', ...data });
    });

    socket.on('disconnect', () =>
      sendBack({
        type: 'PARTICIPANT_DISCONNECTED',
        participantId: socket.id,
      }),
    );
  });

  receive((event) => io.to(roomId).emit(event.type, event));

  return () => {
    io.to(roomId).disconnectSockets(true);
  };
});
