import { generateRound } from '@/server/lib/actors';
import { GameMachine, MultiplayerGuess } from '@/server/lib/models/gamemachine';
import { Room, User } from '@/server/lib/models/room';
import { sendPlayerToRoom } from '@/server/lib/multiplayer/actions';
import { isCorrect } from '@/server/lib/multiplayer/guards';
import { Player } from '@prisma/client';
import { Queue } from 'elegant-queue';
import { Server } from 'socket.io';
import { assign, createActor, enqueueActions, setup } from 'xstate';

export type UserGameInfo = {
  info: User;
  score: number;
};

const updateUserScore = (users: UserGameInfo[], currentGuess: MultiplayerGuess): UserGameInfo[] => {
  const otherUsers = users.filter((user) => user.info.id != currentGuess.userId);
  const currentUser = users.find((user) => user.info.id == currentGuess.userId)!;

  return [...otherUsers, { ...currentUser, score: currentUser.score + 1 }];
};

export function createMultiplayerMachine(io: Server, room: Room): GameMachine {
  const guessQueue = new Queue<MultiplayerGuess>();

  const queueHasGuess = () => !guessQueue.isEmpty();

  const gameMachine = setup({
    types: {} as {
      context: {
        io: Server;
        room: Room;
        gameState: {
          currentGuess: MultiplayerGuess | undefined;
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
    guards: {
      queueHasGuess,
      isCorrect,
    },
  }).createMachine({
    id: `multi-game-machine-${room.id}`,
    initial: 'waitingForGameStart',
    context: {
      io,
      room,
      gameState: {
        currentGuess: undefined,
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
                users: event.users,
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
          waitingForGuess: {
            always: [
              {
                guard: 'queueHasGuess',
                target: 'processingGuess',
              },
            ],
            on: {
              CLIENT_GUESS: 'waitingForGuess',
            },
          },
          processingGuess: {
            entry: assign(({ context }) => ({
              gameState: {
                ...context.gameState,
                currentGuess: guessQueue.dequeue(),
              },
            })),
            always: [
              {
                guard: 'isCorrect',
                target: 'generatingRound',
                actions: enqueueActions(({ context, enqueue }) => {
                  enqueue.assign({
                    gameState: {
                      ...context.gameState,
                      users: updateUserScore(
                        context.gameState.users,
                        context.gameState.currentGuess!,
                      ),
                    },
                  });
                }),
              },
            ],
          },
        },
      },
    },
  });

  return {
    guessQueue,
    statemachine: createActor(gameMachine).start(),
  };
}
