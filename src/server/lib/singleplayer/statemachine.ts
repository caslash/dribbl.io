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
} from '@/server/lib/singleplayer/actions';
import { generateRound } from '@/server/lib/singleplayer/actors';
import { hasLives, isCorrect } from '@/server/lib/singleplayer/guards';

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
    /** @xstate-layout N4IgpgJg5mDOIC5QHECGBbMACAsqgxgBYCWAdmAHQDuqxALmVAGID2ATmpgMp2pt0BiLgBUAggCVhAfWSicAUQDaABgC6iUAAcWsesRakNIAB6IArACYANCACeiABwBGCgGYLFgJzLXrpwDZ-TzMAFgBfMJtObDwiMkooDDBRfAYANzABWQUpAHkANXlxFXUkEG1dBgMjUwQnV08XTwB2Vwd-M08Q9xDPG3sEC38QijNQjwcQyYdlC1dmiKik3AIScgpEzBT0ylhefkZogRKjCr1qstrG5ooHXydPBzHfP37zCxGvMd6zZWG5-yLEDRFZxdabZKpYgZDZgchsVAMUhQcQsACupAgAggBkoZDSLAA1pQQbE1gkkttoQk4WAEUiUejMQh8Sx8Ij9KQSicymcqoZLohrrd7o9nvc3ghhp85g5PMFQs1-EqgaTVvENpSoTCaHpkawOGi4LABABhAAyAEl5AA5aTIACq8i4XB5Wh05wFoFqrmUZlGnnm8ycQzMvpCkoaFjczmUzU8Fh88eUgdVyzJGohVJ1tAZBuQRtgJq4AGlLQAFN3lD38mqIDqeUZmB5mByJl7Nax2RBRmNOWadBytftONOYUHkzVbbW7QnETSaRiojFYqt8zl1hDCu5+MVhiXdhDdVyjdxhiytp7y1xjmLq8FanYUWBzhdLpmrpyld2VDeCrdODcO4PE8+6vIebQOBQFghnMoRRv4vjhJEwLpveFLTk+mhsGyxqHIWJprjWf7eogXjRmevwhKEHT1CE-iSs07SjHK8a+s2HjUbeE6Zo+1IUNhuFFvhxrHF+pzERcpGDAmbgXlRNHNq49GSiEITRg8riWAmjQWEqwTcRmD6Yfxgn4HhyIFqJigWN+1a-lJJhkbJlHKNR9FKSph56coFB+om7TtNRwTzIZ6FTpCT4QrkGRsMcagSQ5XpOXUDRNK07SdN0Hx9BBTgjK4gRMb8-lmBEKGkCwEBwEYapgmAiWepuAC0uUDM1-ryl13U9TeKF1ZOup5uw0Q8HwdCNbW-5OGYgTQXc8ahHc-hOE4DiSh8J6xvpMFDnGo79Wh9URdmDW8pJyU+m1iBrdGna6ctbltMhSzjkZGGRfxezjYcSSTSRKXNK2FDeCmHxDM0yh-Kp8qjFMa1-MqemzWFx1ZjOsLwhyyLLpi-2ObUq1+H5vTzN0DgU60zSSr8-ijExyjOB0rSBhYqOTujT5DYw+YEfjl2ICETHzd4UaJn8viqVDFD+B8Ka9EEykzezvEmTCL7zouOMfvzm5A-6liTC0vizGDkayeM8E0Z2-h+irxmfTCZkWVAVlFrr-5DhtMyjPl9wzXKISzPbH2nRFMV0h70mrStMsNB0oTePlCYbUD0EzUEFhts0VOAuVQA */
    id: 'Game Machine',
    initial: 'waitingForGameStart',
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
      waitingForGameStart: {
        entry: assign({
          socket: undefined,
          gameState: { score: 0, currentPlayer: undefined, validAnswers: [], lives: 0 },
        }),
        on: {
          START_GAME: 'gameActive',
        },
      },

      gameActive: {
        initial: 'startingGame',
        states: {
          startingGame: {
            entry: assign(({ context, event }) => ({
              socket: event.socket,
              gameState: { ...context.gameState, lives: 4 },
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
            always: { target: '#Game Machine.waitingForGameStart', actions: 'notifyGameOver' },
          },
        },
      },
    },
  });

  return createActor(gameMachine);
}
