import { Player } from '@prisma/client';
import { DefaultEventsMap, Socket } from 'socket.io';
import { Actor, AnyStateMachine, assign, createActor, enqueueActions, setup } from 'xstate';

import { sendPlayerToClient, waitForPlayers } from '@/server/lib/statemachine/actions';
import {
  generateRound,
  notifyCorrectGuess,
  notifyIncorrectGuess,
} from '@/server/lib/statemachine/actors';
import { isCorrect } from '@/server/lib/statemachine/guards';

export function createGameMachine(): Actor<AnyStateMachine> {
  const gameMachine = setup({
    types: {} as {
      context: {
        socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> | undefined;
        gameState: {
          round: number;
          score: number;
          currentPlayer: Player | undefined;
          validAnswers: Player[];
        };
      };
    },
    actions: {
      waitForPlayers,
      sendPlayerToClient,
    },
    actors: {
      generateRound,
      notifyCorrectGuess,
      notifyIncorrectGuess,
    },
    guards: {
      isCorrect,
    },
  }).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QHECGBbMACAsqgxgBYCWAdmAHTEQA2YAxAMIDyAcqwKKMAqA2gAwBdRKAAOAe1jEALsXGkRIAB6IATPwCsFAJwBmVaoDs21QA4NpwwEYAbDYA0IAJ6IruqxTcaALFbPbDDX5+U10AXzDHNExcAhJyCigMMABBfFkANwYAEQBJAGUWdi4+IUUJKVl5RRUEdS09A2MzC2s7RxcEUw99VW03b21zK293CKjk2KIySiTMNMzKAHdUGQAxcQAnAAUaVCcwTdh6fO4UgCVS4SQQCpk5BRvavtUKfQ0NNyshwxsgww6iFM3kMFFMqn+I0Mpn4qls4xA0WweGmCTmqXSxCyFFg0lQm1kpCgSPoAmuYkk92qT0Q1n4FF+fV+4KC7gBziBgze-kMvP4visvIRSKm8VmyQWWNmYHIm1QhKg53EAFdSBB6BB5JQyBlxABrSgilFixISzHYmCy+VkRUqtUIHXifDW+RksnlSlVR6gWp+fi6N56QVmXmGXR6QEIQLaBk2XT8Kz8GxGbyWYWTY0zU3zc3LVbSDabZDKuDHRgAGVyHFY3AA+sgAKocfL5d03O5emquVS6AP9bzBJPhmzabyqSMg0wUOOJmzQz5jpMadMxTNos2LCiiTZO0s24ul0lldueh5duombkfL4-P78dmdZmeX5xmyhXTeDR-FfIuJZ9GSti267rAUhEgeoGklY5K3Ke1I+mol7vJ87i3v8kbJt4FAaKob7aP0+EWOCP6iv+G5ShQ+BbJsYDpBBxyagkjoGhQRp-uuOablRmw0XRJagQ6pC6s6XpuseFKVGeNJRomsZMm+EL+oKka-KCozeBpeifhCH4kWu4qcRRZDcbx0j0RqWpUEJ+qGhm7EGRim7GdRtFmfxsCCcJLqkGJMEdlJCEIAE9KND2lg+NY3gOByCDJgG0IglYgpJbo5gRJEICkOIEBwIobGomAHqSfByiIAAtNFnQVXp9lULQhUnsV3qlQgY6RpewSmHO2ghJ8I6GKoNUFdmjlSkVVLNbUgyRuGPQhFYPi6DhPVxt4Q0mgBuYUCs6xbLs+yHPAjUTeeSVaN0nwhNoGipW0uiRuCWEWAtoSLTYUU2OtZGGdiuL4gqSLjZ20lBCF3y4bCA6mMCpgPSCOhdTd-I4Z80NfRxo0WjKhzWkSSqqhAQMBS1AQNL0t0RSMlW0hooJhiOc4DaOmjow5gF5rtRbuUTJW+gONjTvwQb3iYIxJhhqhYaOBjvZ+ARdVYrMjezW47vge7gdzx3A4FAQTpYnjvSYcLQ74FifRl+UbeR2Ima59E85NiCflh6nQzYCajoY-IqWO06WJoqOTnCSubU5pB23xpaO+edJyQECmsspMUaPhFD+mGgofELbjaOlYRAA */
    id: 'Game Machine',
    initial: 'idle',
    context: {
      socket: undefined,
      gameState: {
        round: 0,
        score: 0,
        currentPlayer: undefined,
        validAnswers: [],
      },
    },
    states: {
      idle: {
        on: {
          CONNECT: 'gameActive',
        },
        entry: assign({
          socket: undefined,
          gameState: { round: 0, score: 0, currentPlayer: undefined, validAnswers: [] },
        }),
      },

      gameActive: {
        initial: 'waitForPlayers',
        on: {
          DISCONNECT: 'idle',
        },
        states: {
          waitForPlayers: {
            entry: enqueueActions(({ event, enqueue }) => {
              enqueue.assign({ socket: event.socket });
              enqueue('waitForPlayers');
            }),
            on: {
              START: 'startingGame',
            },
          },
          startingGame: {
            always: { target: 'generatingRound' },
          },
          generatingRound: {
            invoke: {
              src: 'generateRound',
              onDone: {
                target: 'waitForGuess',
                actions: enqueueActions(({ context, event, enqueue }) => {
                  enqueue.assign({
                    gameState: {
                      round: context.gameState.round + 1,
                      score: context.gameState.score,
                      currentPlayer: event.output.player,
                      validAnswers: event.output.validAnswers,
                    },
                  });
                  enqueue('sendPlayerToClient');
                }),
              },
            },
          },
          waitForGuess: {
            on: {
              CLIENT_GUESS: 'processingGuess',
            },
          },
          processingGuess: {
            always: [
              {
                guard: 'isCorrect',
                target: 'correctGuess',
              },
              { target: 'incorrectGuess' },
            ],
          },
          correctGuess: {
            invoke: {
              src: 'notifyCorrectGuess',
              onDone: { target: 'generatingRound' },
            },
          },
          incorrectGuess: {
            invoke: {
              src: 'notifyIncorrectGuess',
              onDone: { target: 'waitForGuess' },
            },
          },
        },
      },
    },
  });

  return createActor(gameMachine);
}
