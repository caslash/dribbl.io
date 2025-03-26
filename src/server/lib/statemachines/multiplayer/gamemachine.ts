import { GameMachine, MultiplayerGuess } from '@/server/lib/models/gamemachine';
import { Room, User } from '@/server/lib/models/room';
import { generateRound } from '@/server/lib/statemachines/actors';
import { sendPlayerToRoom } from '@/server/lib/statemachines/multiplayer/actions';
import { isCorrect } from '@/server/lib/statemachines/multiplayer/guards';
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
    /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgHd1cAXAqAMQHsAnAcXVTAGUr0mqBiTgBUAggCUhAfRYiAsgFEA2gAYAuolAAHBrGq4G+DSAAeiAKwAmADQgAnogAsATgBsJAMxmAjC+UWAHBZmZn4AvqE2aFh4hKRQ7GAimDQAbmAksDx8tGwc-CrqSCDaujQGRqYIDn4kThZe-g4Oll4A7F5ODjb2Vc0k-k7uyoH17g7+-q1m4ZEYOATEJPEcSanpMIRM6DT4UGIMAK74EPwQBukEKQwA1ulR87FLCau4aUtgm9u0+0cQCJcMTBfAwFApGEp6cpFSqtAK1FyTdytZRORrKdz+brmVr+EgWZz+YJeCztMxOVozED3GKLZaJZKvdIUPS7RisA5wWD8ADCABkAJLyAByUhYAFV5JxOGCihCyoZoYhBm5-J5OhYMS4EV53FiEESSLCXO4nJYAoT3F5KdSFnFngy3sydvRmCwObAuTKtDpIQrQJUvF4USQ2g0zDjlM5I3rfLjyS4mk5yU4Gl4HNa5jS7SsHelNExAZycu7PWpwT75RVEIGQoaQsNPAMXGmnHqHEGSM5US4pkiTe3whEQPgGBA4EYbbFy6V9H6TIgALQuPVLkjKdcbzebilDyeLJ20Nm5LhZKjT31VqrWOyIfxeEj19fIhwWbX+FwZ6K2p45tbnyuKggHRmLUZiWhYTjrhM7guK2N4IO4FgWLUSbkmSHT4lqn4PLS9prBkp45Ak-6zpe+LuKB4GQcMqqwW29QeIMyjeM0CJjBY2FZj+9L4RsYBbM6PzHCRUL+o4qJrl4wTvkGUykvR94mkMLFmGxL6cd+dIvI6lDOkeJYiXOlSDMhAzKM2xqtL4qmYvBvitHir4OK0poQa57gaY8Wm5iQ+aFh6xacoZl7EpMtRImBsFDI0rT0RRAzRUmlo9k4g6hEAA */
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
              {
                target: 'waitingForGuess',
                actions: assign(({ context }) => ({
                  gameState: { ...context.gameState, currentGuess: undefined },
                })),
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
