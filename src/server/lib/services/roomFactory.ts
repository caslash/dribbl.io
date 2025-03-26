import { Room, User } from '@/server/lib/models/room';
import { createMultiplayerMachine } from '@/server/lib/statemachines/multiplayer/gamemachine';
import { createSinglePlayerMachine } from '@/server/lib/statemachines/singleplayer/gamemachine';
import { Server, Socket } from 'socket.io';

export function createSinglePlayerRoom(socket: Socket): Room {
  const room: Room = {
    id: '',
    gameMachine: undefined,
    users: [],
  };

  room.gameMachine = createSinglePlayerMachine(socket);

  socket.on('start_game', () => {
    room.gameMachine?.statemachine.subscribe((s) => {
      socket.emit('state_change', s.value);
    });

    socket.on('client_guess', (guessId: number) =>
      room.gameMachine?.statemachine.send({ type: 'CLIENT_GUESS', guessId }),
    );

    socket.on('skip_round', () => room.gameMachine?.statemachine.send({ type: 'SKIP' }));

    socket.on('disconnect', () => {
      room.gameMachine?.statemachine.stop();
    });

    room.gameMachine?.statemachine.send({ type: 'START_GAME', socket });
  });

  return room;
}

export function createMultiplayerRoom(io: Server, socket: Socket, roomId: string): Room {
  const room: Room = {
    id: roomId,
    gameMachine: undefined,
    users: [],
  };

  room.gameMachine = createMultiplayerMachine(io, room);

  socket.on('start_game', (users: User[]) => {
    room.gameMachine?.statemachine.subscribe((s) => {
      io.to(room.id).emit('state_change', s.value);
    });

    setUpListenersOnJoin(socket, room);

    room.gameMachine?.statemachine.send({ type: 'START_GAME', users });
  });

  return room;
}

export function setUpListenersOnJoin(socket: Socket, room: Room) {
  socket.on('client_guess', (guessId: number) => {
    room.gameMachine?.guessQueue?.enqueue({ userId: socket.id, guessId });
    room.gameMachine?.statemachine.send({ type: 'CLIENT_GUESS' });
  });

  socket.on('disconnect', () => {
    room.gameMachine?.statemachine.stop();
  });
}
