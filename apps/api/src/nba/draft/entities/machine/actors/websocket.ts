import { SocketActorEvent } from '@/nba/draft/entities/machine/events/outbound';
import { Server, Socket } from 'socket.io';
import { fromCallback } from 'xstate';

export type SocketActorInput = {
  io: Server;
  roomId: string;
};

export const socketActor = fromCallback<SocketActorEvent, SocketActorInput>(
  ({ input, sendBack, receive }) => {
    const { io, roomId } = input;

    io.on('connection', (socket: Socket) => {
      socket.on('PARTICIPANT_JOINED', (data) =>
        sendBack({ type: 'PARTICIPANT_JOINED', ...data }),
      );
      socket.on('PARTICIPANT_LEFT', (data) =>
        sendBack({ type: 'PARTICIPANT_LEFT', ...data }),
      );
      socket.on('ORGANIZER_CONFIGURE', () =>
        sendBack({ type: 'ORGANIZER_CONFIGURE' }),
      );
      socket.on('SAVE_CONFIG', (data) =>
        sendBack({ type: 'SAVE_CONFIG', ...data }),
      );
      socket.on('MIN_PLAYERS_MET', () => sendBack({ type: 'MIN_PLAYERS_MET' }));
      socket.on('PLAYER_LEFT', () => sendBack({ type: 'PLAYER_LEFT' }));
      socket.on('ORGANIZER_START_DRAFT', (data) =>
        sendBack({ type: 'ORGANIZER_START_DRAFT', ...data }),
      );
      socket.on('ORGANIZER_CANCEL_DRAFT', () =>
        sendBack({ type: 'ORGANIZER_CANCEL_DRAFT' }),
      );
      socket.on('SUBMIT_PICK', (data) =>
        sendBack({ type: 'SUBMIT_PICK', ...data }),
      );
      socket.on('TURN_TIMER_EXPIRED', () =>
        sendBack({ type: 'TURN_TIMER_EXPIRED' }),
      );
      socket.on('PARTICIPANT_DISCONNECTED', (data) =>
        sendBack({ type: 'PARTICIPANT_DISCONNECTED', ...data }),
      );
      socket.on('PARTICIPANT_RECONNECTED', (data) =>
        sendBack({ type: 'PARTICIPANT_RECONNECTED', ...data }),
      );
      socket.on('AUTO_PICK_RESOLVED', (data) =>
        sendBack({ type: 'AUTO_PICK_RESOLVED', ...data }),
      );
      socket.on('POOL_UPDATED', (data) =>
        sendBack({ type: 'POOL_UPDATED', ...data }),
      );
    });

    receive((event) => io.to(roomId).emit(event.type, event));

    return () => {
      io.to(roomId).disconnectSockets(true);
    };
  },
);
