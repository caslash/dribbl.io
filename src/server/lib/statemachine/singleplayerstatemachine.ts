import { Player } from '@prisma/client';
import { DefaultEventsMap, Socket } from 'socket.io';
import { Actor, AnyStateMachine, assign, createActor, enqueueActions, setup } from 'xstate';

import {
  notifyCorrectGuess,
  notifyGameOver,
  notifyIncorrectGuess,
  notifySkipRound,
  sendPlayerToClient,
  waitForUser,
} from '@/server/lib/statemachine/actions';
import { generateRound } from '@/server/lib/statemachine/actors';
import { hasLives, isCorrect } from '@/server/lib/statemachine/guards';

export function createSinglePlayerMachine(): Actor<AnyStateMachine> {
  const gameMachine = setup({
    types: {} as {
      context: {
        socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> | undefined;
        gameState: {
          score: number;
          currentPlayer: Player | undefined;
          validAnswers: Player[];
          lives: number;
        };
      };
    },
    actions: {
      waitForUser,
      sendPlayerToClient,
      notifyCorrectGuess,
      notifyIncorrectGuess,
      notifySkipRound,
      notifyGameOver,
    },
    actors: {
      generateRound,
    },
    guards: {
      isCorrect,
      hasLives,
    },
  }).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QHECGBbMACAsqgxgBYCWAdmAHTEQA2YAxAMIDyAcqwKKMAqA2gAwBdRKAAOAe1jEALsXGkRIAB6IATPwCsFAJyqAjABZVAdlXbtGg-wMaANCACeiPQGZ+FAy9WqAHBu0AbAbG2j7GPgC+EfZomLgEJOQUUBhgAIL4sgBuDAAiAJIAyizsXHxCihJSsvKKKgjqWrqGJmYWVjb2Tgg+ehR6vX69eoEmkdEgsdh4RGSUKZgZ2ZQA7qgyAGLiAE4ACjSoDmDbsPSF3GkASuXCSCBVMnIKd-XaxgEUxsYGHQbarvxVF1EN9jP1zC4fKovEZLOMYql4rMkgt0pliDkKLBpKhtrJSFApvQBLcxJJHrUXs5VAYPqogqp-C4XNp+NojMCEN8fBQAoF3sYXBoNDTtFEEXEZol5qklhj5mByNtUPioJdxABXUgQegQeSUMhZcQAa0oUyR0uSsvRmJgSpVZDVmu1CEN4nwDvkJJJlXJNWeoHqehpdIZTJZbI5jkQwTBNh8bJcIR8Lh+enFk0RUrmVsWNtW62kW22yA1cFOjAAMvkOKxuAB9ZAAVQ4hUKPruD39dUQQRc-XjQvaNhMnL+TQCGn4SYGIrhAQz5uzKOtywoa02O1L5bOAGl8rsO2Tqk8ewg3h8vj9rH8AUDowgGRRrC49AFob4vhpF1mEjnUXKmKwMaxCiOqWo6ke9x+qeVIIMGtIUPSsLaMyrLsve3R9hQliaMEQ7vLoP6Sn+K55muojbO65aOtusCnFBXawYGai6BQr6svwAyuDS04uJyPh8jhIz0iEwp8gE6YTEupEyuR8oUJR1H0bRZb0cSeiktBJ6UixDRsRx-Bcb0MJ8ZyQR9OEugaEmGg+D4oSqMR0yybmaIUVR+A0QSdEMaoWlMbpyisao7EjEZ3GmcynLfNoHg2PhxiWEmITORa-6rgp+A7NsYCZL5xIVJ2MFBfUvRaCY1gjIKeiuCmAn-Eh3Lvuopj8GEaXLnJ7kKWQ2XbLl+VqQxRXHhSAbBY+Bg8oYdlDpYI7GOZBh9NYeGCv4hFOdJv7It1gHdcwOTbIVAUlRN9RBDNg7+AtIpLQ+3K8vyAQbSKfxRBMpDiBAcCKDJe2+jpF2IAAtAEnLg8+Rkw7DMP6J1rnUHQQPjWeUbdI1wYRa+dmoeYUkSi5e1uQdqPdnBfychGTXvp4jJvvwQSIyTAH5uuhbFvshzHPAxXA2e5VNVVbyvnV-GPdCny0lOrjsvZmgs5abNrtiuKqlM5PMZNejtWCqZmICxgjIJegxVL3yTlxLLTQm347SRrOZbairHA6BLgdqWulc4tI8rojIMpJIoQw+PhWE1hHtXyb7hErGXyZiG5Fluw3eyDPRvjhbj6FC7KvdC5nMhQ4eplOK0DFd8dkT1QEgWBzoQOnZ662E7FGKyJgm5J5kDDhncaLV-DhFY9tE+lNcHYpnneYSaf82jcFvDFK1IV4wb8poXzGNX+3s-1g3SL5zdwVbOE0jCDkBJC00CQ5vJ4-yIx6OE23j11pPs31OV5Uf89jRTPSsZPg0gTP8CuGhwgSywlnNkgJB66xHorB2xNlbO0OsdE+QDwgeG+HZMI04AjBwMObfsltZY2wVvbKIQA */
    id: 'Game Machine',
    initial: 'idle',
    context: {
      socket: undefined,
      gameState: {
        score: 0,
        currentPlayer: undefined,
        validAnswers: [],
        lives: 0,
      },
    },
    states: {
      idle: {
        on: {
          CONNECT: 'gameActive',
        },
        entry: assign({
          socket: undefined,
          gameState: { score: 0, currentPlayer: undefined, validAnswers: [], lives: 0 },
        }),
      },

      gameActive: {
        initial: 'waitingForUser',
        on: {
          DISCONNECT: 'idle',
        },
        states: {
          waitingForUser: {
            entry: enqueueActions(({ event, enqueue }) => {
              enqueue.assign({
                socket: event.socket,
                gameState: {
                  score: 0,
                  currentPlayer: undefined,
                  validAnswers: [],
                  lives: 0,
                },
              });
              enqueue('waitForUser');
            }),
            on: {
              START: 'startingGame',
            },
          },
          startingGame: {
            entry: assign(({ context, event }) => ({
              socket: event.socket,
              gameState: { ...context.gameState, lives: 2 },
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
                  enqueue('sendPlayerToClient');
                }),
              },
            },
          },
          waitingForGuess: {
            on: {
              CLIENT_GUESS: 'processingGuess',
              SKIP: 'skippingRound',
            },
          },
          skippingRound: {
            always: [
              {
                guard: 'hasLives',
                target: 'generatingRound',
                actions: enqueueActions(({ context, enqueue }) => {
                  enqueue.assign({
                    gameState: { ...context.gameState, lives: context.gameState.lives - 1 },
                  });
                  enqueue('notifySkipRound');
                }),
              },
              { target: 'gameOver' },
            ],
          },
          processingGuess: {
            always: [
              {
                guard: 'isCorrect',
                target: 'generatingRound',
                actions: enqueueActions(({ context, enqueue }) => {
                  enqueue.assign({
                    gameState: {
                      ...context.gameState,
                      score: context.gameState.score + 1,
                    },
                  });
                  enqueue('notifyCorrectGuess');
                }),
              },
              {
                guard: 'hasLives',
                target: 'waitingForGuess',
                actions: enqueueActions(({ context, enqueue }) => {
                  enqueue.assign({
                    gameState: { ...context.gameState, lives: context.gameState.lives - 1 },
                  });
                  enqueue('notifyIncorrectGuess');
                }),
              },
              { target: 'gameOver' },
            ],
          },
          gameOver: {
            always: { target: 'waitingForUser', actions: 'notifyGameOver' },
          },
        },
      },
    },
  });

  return createActor(gameMachine);
}
