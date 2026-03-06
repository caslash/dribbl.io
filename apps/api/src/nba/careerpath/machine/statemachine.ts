import { actions } from '@/nba/careerpath/machine/actions';
import {
  generateRoundActor,
  RoundProps,
} from '@/nba/careerpath/machine/actors/generate-round';
import { socketActor } from '@/nba/careerpath/machine/actors/websocket';
import { guards } from '@/nba/careerpath/machine/guards';
import { SocketActorInput } from '@/nba/draft/machine/actors/websocket';
import {
  CareerPathContext,
  CareerPathEvent,
  GameDifficulties,
  GameDifficulty,
} from '@dribblio/types';
import { createActor, setup } from 'xstate';

export const createCareerPathMachine = (
  socketInfo: SocketActorInput,
  generateRound: (difficulty: GameDifficulty) => Promise<RoundProps>,
) => {
  const machine = setup({
    types: {
      context: {} as CareerPathContext,
      events: {} as CareerPathEvent,
    },
    actions,
    guards,
    actors: { socketActor, generateRoundActor },
  }).createMachine({
    id: 'careerPathmachine',
    initial: 'waitingForGameStart',
    invoke: {
      id: 'socket',
      src: 'socketActor',
      input: socketInfo,
    },
    context: {
      config: {
        lives: undefined,
        gameDifficulty: GameDifficulties.allPlayers,
      },
      gameState: {
        score: 0,
        validAnswers: [],
        lives: undefined,
      },
    },
    states: {
      waitingForGameStart: {
        entry: 'assignGameStart',
        on: {
          START_GAME: 'gameActive',
          PLAYER_DISCONNECTED: 'closed',
          SAVE_CONFIG: {
            actions: ['assignConfig', 'notifyConfigSaved'],
          },
        },
      },
      gameActive: {
        initial: 'generatingRound',
        on: {
          PLAYER_DISCONNECTED: 'closed',
        },
        states: {
          generatingRound: {
            invoke: {
              src: 'generateRoundActor',
              input: ({ context }) => ({
                difficulty: context.config.gameDifficulty,
                generateRound,
              }),
              onDone: {
                target: 'waitingForGuess',
                actions: ['assignRoundGenerated', 'notifyNextRound'],
              },
            },
          },
          waitingForGuess: {
            on: {
              USER_GUESS: 'processingGuess',
              SKIP: 'skippingRound',
            },
          },
          skippingRound: {
            always: [
              {
                guard: 'hasLives',
                target: 'generatingRound',
                actions: ['assignSkipRound', 'notifySkipRound'],
              },
              { target: 'gameOver' },
            ],
          },
          processingGuess: {
            always: [
              {
                guard: 'isCorrectSinglePlayer',
                target: 'generatingRound',
                actions: ['assignCorrectGuess', 'notifyCorrectGuess'],
              },
              {
                guard: 'hasLives',
                target: 'waitingForGuess',
                actions: ['assignIncorrectGuess', 'notifyIncorrectGuess'],
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
      closed: {
        type: 'final',
      },
    },
  });

  return createActor(machine).start();
};
