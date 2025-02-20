import { Player } from '@prisma/client';
import { DefaultEventsMap, Socket } from 'socket.io';
import { Actor, AnyStateMachine, assign, createActor, enqueueActions, setup } from 'xstate';

import {
  notifyCorrectGuess,
  notifyGameOver,
  notifyIncorrectGuess,
  sendPlayerToClient,
  waitForPlayers,
} from '@/server/lib/statemachine/actions';
import { generateRound } from '@/server/lib/statemachine/actors';
import { hasLives, isCorrect } from '@/server/lib/statemachine/guards';

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
          lives: number;
        };
      };
    },
    actions: {
      waitForPlayers,
      sendPlayerToClient,
      notifyCorrectGuess,
      notifyIncorrectGuess,
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
    /** @xstate-layout N4IgpgJg5mDOIC5QHECGBbMACAsqgxgBYCWAdmAHTEQA2YAxAMIDyAcqwKKMAqA2gAwBdRKAAOAe1jEALsXGkRIAB6IATPwCsFAJwBmVau0AOAGwAWbRpO7dZgDQgAnogCMulxTcaz+l+ZdmGsYAvsEOaJi4BCTkFFAYYACC+LIAbgwAIgCSAMos7Fx8QooSUrLyiioI6lp6Bsbmlta2Ds4IRh76hqoaRj3WAOzaqqHhCVFEZJTxmMlplADuqDIAYuIATgAKNKiOYOuw9DnciQBKRcJIIKUycgpXVap9FPreRkbaZgMBwwOtiB1+BR+IEXKoTFYTPwjPwRmEQBFsHhJrEZkkUsR0hRYNJUOtZKQoIj6AJLmJJLcKg9EP4KKZtAMTE8mQZdP92i4PN5tLCzCYXB8rHCxpFkTFpgk5pjpmByOtUASoKdxABXUgQegQeSUMipcQAa0oiIm4rikoxWJgcoVZCVqvVCF14nwNvkpNJJQp5XuoCqLn4uiMFFZRkC-IZ2hM7IGA10FBjAxhfJj-BM2lGCPGYqmZtmFsWy2ka3WyBVcEOjAAMlkOKxuAB9ZAAVQ4ORyHquN29lVcqaDAzMX10Gk5JnMPXZXyD1k5nO0fnH6fhxuzqPN8woonWzvLttL5ZJxU7XruPeqz1eZnen2+FlUfyciG+2mDfTBlj0Y4zK+iObRUqxLcd1gKRCX3ECSRcMlrhPKlfTUC8eivD4vh+e92SCF8A1jCFoV6SMlxFJFfzXPMN3wDZ1jAFJwMODtyTKU9qQQWl6UZZkDFUNlHwQAcPHBMEBkMaw72-LMSIlMjpSoUgKPWKiaLLCD6Jgxi4OUAEwWDbQbz6D56nZJkPH4PwNGhQINCE+dQnhUhxAgOBFB-FEwE9NSfQ0hAAFoox4rzah0wKgsC0wxNFCSqFoVzj3cs8zFUdlhmBaETCMQMBRcHkQTC4iXNzdF5jcykPKqCx2V0ecXmhAUoXnfhNByk0-3XaSllWDZtl2fZ4Bi4qz05LQOjMoZbAjUMNGjUw6RMqFNDMTl710RrV0kgrpJxPFFURIru2Yq84xHEF6u8GcjAGCaeMBYNU35DQDHO75hUzcK8v-fM4llfYbUJZU1QgHamPgjlVG03SnmGQxo2+eMRwHD5rCMKxCOe3LTTejc2qLDZaIB9S-R6DxB3q4TvnfB82kTLQNFsVRUMymFGWWiL0ekoD8F3MClJ6hi+uYhlDJcAZPAHfgdNTHxBxcJnXparE5IU6Qcd63agf2ihDrMY6+XcM6LopiqdAFUxhyE-0BmltHZZ1WTKOoxWudxkqaXmuk03Y0xOO4tpwwoEwRbF8xbHmmzgiAA */
    id: 'Game Machine',
    initial: 'idle',
    context: {
      socket: undefined,
      gameState: {
        round: 0,
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
          gameState: { round: 0, score: 0, currentPlayer: undefined, validAnswers: [], lives: 0 },
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
            entry: assign(({ context }) => ({ gameState: { ...context.gameState, lives: 2 } })),
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
                      ...context.gameState,
                      round: context.gameState.round + 1,
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
              SKIP: 'skipRound',
            },
          },
          skipRound: {
            entry: assign(({ context }) => ({
              gameState: { ...context.gameState, lives: context.gameState.lives - 1 },
            })),
            always: { target: 'generatingRound' },
          },
          processingGuess: {
            always: [
              {
                guard: 'isCorrect',
                target: 'correctGuess',
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
                target: 'incorrectGuess',
                actions: 'notifyIncorrectGuess',
              },
              { target: 'gameOver' },
            ],
          },
          correctGuess: {
            always: { target: 'generatingRound' },
          },
          incorrectGuess: {
            entry: assign(({ context }) => ({
              gameState: { ...context.gameState, lives: context.gameState.lives - 1 },
            })),
            always: { target: 'waitForGuess' },
          },
          gameOver: {
            entry: enqueueActions(({ enqueue }) => {
              enqueue('notifyGameOver');
            }),
            always: { target: 'waitForPlayers' },
          },
        },
      },
    },
  });

  return createActor(gameMachine);
}
