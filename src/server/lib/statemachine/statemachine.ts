import { Player } from '@prisma/client';
import { DefaultEventsMap, Socket } from 'socket.io';
import { Actor, AnyStateMachine, assign, createActor, enqueueActions, setup } from 'xstate';

import { sendPlayerToClient, waitForPlayers } from '@/server/lib/statemachine/actions';
import {
  generateRound,
  notifyCorrectGuess,
  notifyIncorrectGuess,
  processGuess,
} from '@/server/lib/statemachine/actors';

export function createGameMachine(): Actor<AnyStateMachine> {
  const gameMachine = setup({
    types: {} as {
      context: {
        socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> | undefined;
        gameState: { round: number; score: number; currentPlayer: Player | undefined };
      };
    },
    actions: {
      waitForPlayers,
      sendPlayerToClient,
    },
    actors: {
      generateRound,
      processGuess,
      notifyCorrectGuess,
      notifyIncorrectGuess,
    },
    guards: {
      isCorrect: ({ context, event }) => {
        //Do something
        return true;
      },
    },
  }).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QHECGBbMACAsqgxgBYCWAdmAHTEQA2YAxAMIDyAcqwKKMAqA2gAwBdRKAAOAe1jEALsXGkRIAB6IAjAGZ+FAJy7tADlUAmAOyrtANlMAaEAE9ER-SYomArP35v1RgCz9fC35tXwBfUNs0TFwCEnIKKAwwAEF8WQA3BgARAEkAZRZ2Lj4hRQkpWXlFFQQNLT0DYzNLG3tHdRcjD351NyD9Zwt9C3DIpJiiMkpEzFSMygB3VBkAMXEAJwAFGlQ7MHXYejzuZIAlEuEkEHKZOQUrmrdzCiMLPt99AKNXjtsHBDcRi03S8-CGJjBwVGICi2Dwk3iMxSaWImQosGkqHWslIUFh9AElzEkluVQeiG06n0FECzn8RlU3lM2j+iEBRgonk8vnU6gsJhMXSM0NhEzi0ySc1R0zA5HWqBxUFO4gArqQIPQIPJKGR0uIANaUUXw8UJSUotEwOUKshK1XqhC68T4G3yQmEsokyr3UA1VQ81QUfQ8wWWEw+NwC1kID6+Cjmfj+wxuNzaPxdEXjE1TM2zC2LZbSNbrZAquCHRgAGRyHFY3AA+sgAKocPJ5D1XG7e6pqQIcjq+XQMty+V6WaOMwNczxmPo+Ew8zPRbOI83zCiidbO8u20vlgmlTteu49gHPV7vT6jn4maO+fyubq+DQdAbaExLuGxHNIqVozfbrAUi4nuQEEqoRLXMeZK+my55vBYHxfDe0ZGO+nJck8Jj6L0-rChEMJZt+q55uu+AbOsYBpKBhxavETqGhQxrERKpHShQ5HrJR1FlkBjqkHqLreu6h7EhUJ7kgglLUrSC78MO84sm0MYPtOqjmGYbzyZ+Yo-mu7FkJx3HSDRmralQAkGkaREIqxyLroZFFUSZvGwPxgmuqQImQV2EmwbU5jUvyqhvvSQJuKhlgvN0vKjqmqgBOo4QEaQ4gQHAijMbZnriTByiIAAtBY0YFX4GHThVnj+jpK46rQYA5aSPr5TGRioTyFC8ryZgDPwnzuElBFZaav75o13aSaYbg6GCrxoT03y9NGFjqBQILBH1fiGBYqg1Sxub2exSyrBs2y7Ps8BHrlzU1Ooo6uCFC73u+vipsVymDi461UpYFhWG4e22Qdf6UBiWKKrC41+S1grUqmHR9AKzKvNGgJTtOf2Alh+iAyN+mWrK+w2riypqhAUN5X6QKrcFoXyeFd76Byz7BfwckIe4uN6WxaLHUWGw0RTN1qCt00mBzOHvOYviRS47jcmzr1+FYXMkYd-5bvgO4ga5Qunj4q3aLNVhGz4RhLR9Tjxl0nhUk9I7VUNNl4zzlBGc5gtXU1p5DByCUhJ4VgMndt4fYya1clNIZ-SMTvLvto0OaQ7s8eWeuSdJNLgvSjKKahZiPlVqaCupITJaEQA */
    id: 'Game Machine',
    initial: 'idle',
    context: {
      socket: undefined,
      gameState: {
        round: 0,
        score: 0,
        currentPlayer: undefined,
      },
    },
    states: {
      idle: {
        on: {
          CONNECT: 'gameActive',
        },
        entry: assign({
          socket: undefined,
          gameState: { round: 0, score: 0, currentPlayer: undefined },
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
                      currentPlayer: event.output,
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
