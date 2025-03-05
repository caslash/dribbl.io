import { User } from '@/server/lib/models/room';
import { Player } from '@prisma/client';
import { DefaultEventsMap, Server } from 'socket.io';
import { Actor, AnyStateMachine, createActor, setup } from 'xstate';

export function createMultiplayerMachine(io: Server, roomId: string): Actor<AnyStateMachine> {
  const gameMachine = setup({
    types: {} as {
      context: {
        io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
        roomId: string;
        gameState: {
          users: { info: User; score: number }[];
          currentPlayer: Player | undefined;
          validAnswers: Player[];
        };
      };
    },
  }).createMachine({
    id: 'Multi Game Machine',
    initial: 'waitingForGameStart',
    context: {
      io,
      roomId,
      gameState: {
        users: [],
        currentPlayer: undefined,
        validAnswers: [],
      },
    },
  });

  return createActor(gameMachine);
}
