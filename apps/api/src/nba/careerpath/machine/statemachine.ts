import { actions } from '@/nba/careerpath/machine/actions';
import {
  generateRoundActor,
  RoundProps,
} from '@/nba/careerpath/machine/actors/generate-round';
import {
  socketActor,
  SocketActorInput,
} from '@/nba/careerpath/machine/actors/websocket';
import { guards } from '@/nba/careerpath/machine/guards';
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
    /** @xstate-layout N4IgpgJg5mDOIC5QGMCGAnMZ0AVUBcALAWVWUIEsA7MAOgHdUL9qoAxAe3QHFUBbMAGV8GfAGJBAFQCCAJUkB9btOIBRANoAGALqJQABw6xmFDlT0gAHogBMADgAstGwE4AbHYDsAVhefNnna+ADQgAJ6IAIz2tA4u8ZEOnm4u3oEuDgC+maFomNh4RKTk1HSMJlTsXLwCwqJiOAAy0gCaqrIKACIAkoIAwgDyAHJDqn2Sqp1aukgghsYsZhbWCN42oREIkd4OdrS+AMxuNpo2NslukW7ZuRhYuAQkZJQ0DEwslZw8-EIi6OKCaQANVUCkGQzY3W40ws8xMS1mK0S3kitECkQOkU0WLcuMiG0QBwcB1ojgcNm83jsbgcmjcRxuIDy90KTxKrygP2kyBYADcwA1mm0Oj1+sNRuNJjDZnDFuZEVE7EraAdPHF6S47O43N4DgSEB4XPtAti1SlMd5GcyCo9ii86JyBNy+QLpQYjPD5aAVmdNLQXJiXPZNAcXFivN59bqSZFAjYHB41tsHFkcky7jais9SrRHWBnRR+WJ1JEZu6FqYvVYop5PM5TrGXHSHN5cS39cS9p4w1SHJFoljIi4rRmHln2Q6uTzCw6wDR0ARWLIOABXKgQMQQMx0ai8jgAazo1rHbPtuanLtzc+wi8qy7XEAQu44aDl0zdcw9cuWiDsmm8aLuF4mI2JEXinPqQH7JiiRuMkjhKtcabHqydo5nmBb8m8FRVDwK5wLAYgAKqCO0ShEaogiCB+sqVj+CBKiSIZNp4Q6YvSVL6uGewBp4qp+Jo2peCO+QnmhHIXjO2EfLh3D4bAhGCAA0t0OA0V+dEKlsoFGvY0QnIEdihvEXGaMqvH8f4QmeCJLK2tmElOtOWGwPuFD6PoS6ruuxY6LCGkIt6UQ6c4dj6QEjHxC4+phSSaR-vG7i+H+di2Zmp7oZJLluR5XkPsWpb+RWgXVlsraogchweLiPh2GcMVUrQ-Ypk2-4Rb4aViQ5k5OZe+joC+BGsHJBG+WWn7FVWKwgSqKKUimlKapiMU2G4-oZCkOznP4Iadah3Xnr1Un9YNCnDfJhEluNtElSsawAdqvh8WquzLeEwUhvWcQgRixy7Ht9kTod+bOXQJ3IENlQjQpxY2NdAVTVEAR1o4HhxDiqRalx5w2LQKT+BSpxmfYNnIaO+1AxhoPAwM-LoGNRWevR9hOK4Hg+AJgQhO9WyBOt8Rmb4lIHAyjJUBwEBwBYKGA-ajPflpAC0+I84ra2aBrgmxkESSeGcqa3KJFNnuUMlfDUvyiPLmlBQgST6q4dYRdi2IHK4UUA+OZ5Uy61u3Yg3ObK26smlqbvmnSnsZY5IOXjA863lA97rn7iOrH2+zHN4mhJHpSrRTzRl7EOJq9tncQG+mRuy5lR1YabrDmxdqf0Vi5L85qTaDu7plarEqq0kZz39jYUfiT1sdSa57meXe3kQC3WkYvEtCnESZx-rsFINWtRwpvSbVJDsY8HT7x0DRDZ1Q83MoI63AT6v4AFeH+qq4jSdKk4bdle7Xk9YXmWm2BF621jPGJqqR7Bhl4m4Okj8NbGk3pcEWlU1QnyBsgAANkYSAIDSpwS4nVVEgkjiJH-KQmk2RshAA */
    id: 'careerPathMachine',
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
        entry: 'assignGameStart',
        always: [
          {
            guard: 'configSet',
          },
          { target: 'waitingForGameStart' },
        ],
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
              onError: {
                target: 'generatingRound',
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
              // Last life used — notify client (lives: 0) before ending the game
              { target: 'gameOver', actions: ['assignSkipRound', 'notifySkipRound'] },
            ],
          },
          processingGuess: {
            always: [
              {
                guard: 'isCorrect',
                target: 'generatingRound',
                actions: ['assignCorrectGuess', 'notifyCorrectGuess'],
              },
              {
                guard: 'hasLives',
                target: 'waitingForGuess',
                actions: ['assignIncorrectGuess', 'notifyIncorrectGuess'],
              },
              // Last life used — notify client (lives: 0) before ending the game
              { target: 'gameOver', actions: ['assignIncorrectGuess', 'notifyIncorrectGuess'] },
            ],
          },
          gameOver: {
            always: {
              target: '#careerPathMachine.waitingForGameStart',
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
