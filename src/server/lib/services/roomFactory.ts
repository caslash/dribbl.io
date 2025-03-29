import { MultiplayerGuess } from '@/server/lib/models/gamemachine';
import { Room, User } from '@/server/lib/models/room';
import { createMultiplayerMachine } from '@/server/lib/statemachines/multiplayer/gamemachine';
import { createSinglePlayerMachine } from '@/server/lib/statemachines/singleplayer/gamemachine';
import { Server, Socket } from 'socket.io';

export function createSinglePlayerRoom(socket: Socket): Room {
  const room: Room = {
    id: '',
    statemachine: undefined,
    users: [],
  };

  room.statemachine = createSinglePlayerMachine(socket);

  socket.on('start_game', () => {
    room.statemachine?.subscribe((s) => {
      socket.emit('state_change', s.value);
    });

    socket.on('client_guess', (guessId: number) =>
      room.statemachine?.send({ type: 'CLIENT_GUESS', guessId }),
    );

    socket.on('skip_round', () => room.statemachine?.send({ type: 'SKIP' }));

    socket.on('disconnect', () => {
      room.statemachine?.stop();
    });

    room.statemachine?.send({ type: 'START_GAME', socket });
  });

  return room;
}

export function createMultiplayerRoom(io: Server, socket: Socket, roomId: string): Room {
  const room: Room = {
    id: roomId,
    statemachine: undefined,
    users: [],
  };

  room.statemachine = createMultiplayerMachine(io, room);

  socket.on('start_game', (users: User[]) => {
    room.statemachine?.subscribe((s) => {
      io.to(room.id).emit('state_change', s.value);
    });

    room.statemachine?.send({ type: 'START_GAME', users });
  });

  return room;
}

export function setUpListenersOnJoin(socket: Socket, room: Room) {
  socket.on('client_guess', (guessId: number) => {
    const userId = socket.id;
    const guess: MultiplayerGuess = { userId, guessId };
    room.statemachine?.send({ type: 'CLIENT_GUESS', guess });
  });

  socket.on('disconnect', () => {
    room.statemachine?.stop();
  });
}
