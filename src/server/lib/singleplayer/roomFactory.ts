import { Server, Socket } from 'socket.io';
import { Actor, AnyStateMachine } from 'xstate';
import { createMultiplayerMachine } from '../multiplayer/statemachine';
import { createSinglePlayerMachine } from './statemachine';

export function createSinglePlayerRoom(socket: Socket): Actor<AnyStateMachine> {
  const gameActor = createSinglePlayerMachine(socket).start();

  socket.on('start_game', () => {
    gameActor.subscribe((s) => {
      socket.emit('state_change', s.value);
    });

    socket.on('client_guess', (guessId: number) =>
      gameActor.send({ type: 'CLIENT_GUESS', guessId }),
    );

    socket.on('skip_round', () => gameActor.send({ type: 'SKIP' }));

    socket.on('disconnect', () => {
      console.log(`Client disconnected from socket ${socket.id}`);
      gameActor.stop();
    });

    gameActor.send({ type: 'START_GAME', socket });
  });

  return gameActor;
}

export function createMultiplayerRoom(io: Server, roomId: string): Actor<AnyStateMachine> {
  const gameActor = createMultiplayerMachine(io, roomId).start();

  return gameActor;
}
