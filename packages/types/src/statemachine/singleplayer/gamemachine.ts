import { nba } from '@dribblio/database';
import { Socket } from 'socket.io';
import { Actor, AnyStateMachine, assign, createActor, enqueueActions, setup } from 'xstate';
import { generateRound } from '../actors.js';
import { GameDifficulty } from '../gamedifficulties.js';
import { BaseGameService } from '../gameservice.js';
import {
  notifyCorrectGuess,
  notifyGameOver,
  notifyIncorrectGuess,
  notifySkipRound,
  sendPlayerToClient,
  waitForUser,
} from './actions.js';
import { hasLives, isCorrectSinglePlayer } from './guards.js';

export type SinglePlayerConfig = {
  lives: number | undefined;
  gameDifficulty: GameDifficulty;
};

export type SinglePlayerContext = {
  socket: Socket;
  config: SinglePlayerConfig;
  gameState: {
    score: number;
    validAnswers: nba.Player[];
    lives: number | undefined;
  };
};

export function createSinglePlayerMachine(
  socket: Socket,
  config: SinglePlayerConfig,
  gameService: BaseGameService,
): Actor<AnyStateMachine> {
  const gameMachine = setup({
    types: {} as {
      context: SinglePlayerContext;
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
      isCorrectSinglePlayer,
      hasLives,
    },
  }).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QHECGBbMACAsqgxgBYCWAdmAHQDuqxALmVAGID2ATmpgMp2pt0BiLgBUAggCVhAfWSicAUQDaABgC6iUAAcWsesRakNIAB6IATAFYLFAJyWA7ABZlNgGyvlAZk8BGMwBoQAE9EAA4fTwpHR09Q6LtlZQszMwBfVMDObDwiMkooDDBRfAYAN0pYXn5GLIEVdSQQbV0GAyNTBD9XUIoXT3szV3tk0OGLQJCERx8eqwjhn26zRc90zMLcAhJyCgLMYrL8sHI2VAZSKHEWAFdSCAEIA0oyUpYAa0oszdydvaKS4jlXbHMCnc6XG53BAvFj4M76Uj1epGZp6NqNDpdHp9AZDEZjCaICyxKKhVxmez2FahZRmRxrEBfHLbfKFA6Ayg0PQXVgca5wWACADCABkAJLyABy0mQAFV5FwuMjGqjWoYMYhXFYKOELC4LDZaRFXD5CQhXM5ehbPMoLRFHGYbAymVs8rs2QCgVzwbzkPzYIKuABpMUABWVWh0aPVoExiRsFHsZIdjnCNhtMzNVLMOpNoTpnhsBsWFmdG2Zbr+7KBsDexE0mkYV1u9wjTSjavaiCxvXTuOGZlGVjNrhtiYN9k80WmrhsPh8Zcw3xZ7v2noqdYbTchrZ8DUjLQRXc6g2xfcGA6H42CiAGPgoyXTynCjlnowXGUZ5ddvw9hwomhsLCAo1P6gptqqR4auaDoPhSjrdDSnhDGalg5nOdgmlqoQ4fYWqLtkP6smu-6AcBAagQKdR7iiHZQbGmqwckAxuDhXgoTe5qhAmOE2HhZKTj4yj2E6n4uj8xH-KRQH4CBFx+lRihmPu7aHuiDEwTmzEIWxyH2GaoSFhQ3RFjMU5uD4FiuARy6Vn+HKrmAADy5RsHUai0WpMYmOY2p2BYTguO4Xi+AEnHhBQngpDYqbPsShnpukn6kCwEBwEY4ksp50bHgAtK4Zq5dYNglaVZWlchNkVjs3qML6hQ8HwdDZZ20EOmadjGWS2GGdMd5VURjnVmALX0T5CCFgmMwpK+sQOvOAVmiWD5uFO85CTE0RpGJ34SUN64UJUTU1IUo3qeN84uBQPipv0lLTFF3FmoWkQ0s4qYWAtnhWPSO1LtVknDcCJzwhczZ3Gd3mYo4c6RSFSTpq++aOCOyj3rxgyJFjQmln9hF7VWB21Ty7AKQGkPHvmsxCYWdp4bdWbKI4tipn4aNONEU4DQT9k1pujZgzuFPQZd1h4UWUUuHhThZhEvSOsMpURDMuPrP9g2E9J5G6PJYHCxp0T2Nd+Z0qOcTLJZ+mcfYTNdc+sQI4Ok7cyumsOX8LmgvrF3JOj3FmLEs4WPmw7hWO33BcHuruPYSWpEAA */
    id: `single-game-machine`,
    initial: 'waitingForGameStart',
    context: {
      socket,
      config,
      gameState: {
        score: 0,
        validAnswers: [],
        lives: undefined,
      },
    },
    states: {
      waitingForGameStart: {
        entry: assign({
          gameState: { score: 0, validAnswers: [], lives: config.lives },
        }),
        on: {
          START_GAME: 'gameActive',
        },
      },

      gameActive: {
        initial: 'startingGame',
        states: {
          startingGame: {
            entry: assign(({ context }) => ({
              gameState: { ...context.gameState, lives: context.config.lives },
            })),
            always: { target: 'generatingRound' },
          },
          generatingRound: {
            invoke: {
              src: 'generateRound',
              input: { difficulty: config.gameDifficulty, gameService },
              onDone: {
                target: 'waitingForGuess',
                actions: enqueueActions(({ context, event, enqueue }) => {
                  enqueue.assign({
                    gameState: {
                      ...context.gameState,
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
                    gameState: {
                      ...context.gameState,
                      lives: context.gameState.lives ? context.gameState.lives - 1 : undefined,
                      score: !context.config.lives ? 0 : context.gameState.score,
                    },
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
                guard: 'isCorrectSinglePlayer',
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
                    gameState: {
                      ...context.gameState,
                      lives: context.gameState.lives ? context.gameState.lives - 1 : undefined,
                    },
                  });
                  enqueue('notifyIncorrectGuess');
                }),
              },
              { target: 'gameOver' },
            ],
          },
          gameOver: {
            always: {
              target: '#single-game-machine.waitingForGameStart',
              actions: 'notifyGameOver',
            },
          },
        },
      },
    },
  });

  return createActor(gameMachine).start();
}
