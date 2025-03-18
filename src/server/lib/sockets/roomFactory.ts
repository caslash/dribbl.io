import { Room, User } from '@/server/lib/models/room';
import { createMultiplayerMachine } from '@/server/lib/multiplayer/statemachine';
import { createSinglePlayerMachine } from '@/server/lib/singleplayer/statemachine';
import { Server, Socket } from 'socket.io';

export function createSinglePlayerRoom(socket: Socket): Room {
  let room: Room = {
    id: '',
    stateMachine: undefined,
    users: [],
  };

  room.stateMachine = createSinglePlayerMachine(socket).start();

  socket.on('start_game', () => {
    room.stateMachine?.subscribe((s) => {
      socket.emit('state_change', s.value);
    });

    socket.on('client_guess', (guessId: number) =>
      room.stateMachine?.send({ type: 'CLIENT_GUESS', guessId }),
    );

    socket.on('skip_round', () => room.stateMachine?.send({ type: 'SKIP' }));

    socket.on('disconnect', () => {
      room.stateMachine?.stop();
    });

    room.stateMachine?.send({ type: 'START_GAME', socket });
  });

  return room;
}

export function createMultiplayerRoom(io: Server, socket: Socket, roomId: string): Room {
  let room: Room = {
    id: roomId,
    stateMachine: undefined,
    users: [],
  };

  room.stateMachine = createMultiplayerMachine(io, room).start();

  socket.on('start_game', (users: User[]) => {
    room.stateMachine?.subscribe((s) => {
      io.to(room.id).emit('state_change', s.value);
    });

    room.stateMachine?.send({ type: 'START_GAME', users });
  });

  return room;
}
