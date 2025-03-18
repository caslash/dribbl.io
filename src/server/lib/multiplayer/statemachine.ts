import { generateRound } from '@/server/lib/actors';
import { Room, User } from '@/server/lib/models/room';
import { Player } from '@prisma/client';
import { Server } from 'socket.io';
import { Actor, AnyStateMachine, assign, createActor, enqueueActions, setup } from 'xstate';
import { sendPlayerToRoom } from './actions';

export type UserGameInfo = {
  info: User;
  score: number;
};

export function createMultiplayerMachine(io: Server, room: Room): Actor<AnyStateMachine> {
  const gameMachine = setup({
    types: {} as {
      context: {
        io: Server;
        room: Room;
        gameState: {
          users: UserGameInfo[];
          currentPlayer: Player | undefined;
          validAnswers: Player[];
        };
      };
    },
    actions: {
      sendPlayerToRoom,
    },
    actors: {
      generateRound,
    },
  }).createMachine({
    id: `multi-game-machine-${room.id}`,
    initial: 'waitingForGameStart',
    context: {
      io,
      room,
      gameState: {
        users: [],
        currentPlayer: undefined,
        validAnswers: [],
      },
    },
    states: {
      waitingForGameStart: {
        on: {
          START_GAME: 'gameActive',
        },
      },

      gameActive: {
        initial: 'startingGame',
        states: {
          startingGame: {
            entry: assign(({ context, event }) => ({
              gameState: {
                ...context.gameState,
                users: event.users.map((user: User) => ({
                  info: user,
                  score: 0,
                })),
              },
            })),
            always: { target: 'generatingRound' },
          },
          generatingRound: {
            invoke: {
              src: 'generateRound',
              onDone: {
                target: 'waitingForGuess',
                actions: enqueueActions(({ context, event, enqueue }) => {
                  enqueue.assign({
                    gameState: {
                      ...context.gameState,
                      currentPlayer: event.output.player,
                      validAnswers: event.output.validAnswers,
                    },
                  });
                  enqueue('sendPlayerToRoom');
                }),
              },
            },
          },
          waitingForGuess: {},
        },
      },
    },
  });

  return createActor(gameMachine);
}
