import { createActor, createMachine } from 'xstate';

export const gameMachine = createMachine(
  {
    initial: 'idle',
    states: {
      idle: {
        on: {
          CONNECT: 'gameActive',
        },
      },
      gameActive: {
        initial: 'waitForPlayers',
        states: {
          waitForPlayers: {
            entry: [
              {
                type: 'waitForPlayers',
              },
            ],
            on: {
              START: 'startingGame',
            },
          },
          startingGame: {
            invoke: {
              src: 'startGame',
              onDone: { target: 'generatingRound' },
            },
          },
          generatingRound: {
            invoke: {
              src: 'generateRound',
              onDone: { target: 'waitForGuess' },
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
                target: 'generatingRound',
              },
              { target: 'incorrectGuess' },
            ],
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
  },
  {
    guards: {
      isCorrect: ({ context }) => {
        //Do something
        return true;
      },
    },
    actions: {
      waitForPlayers: (context, event) => {
        console.log('WAITING FOR PLAYERS');
      },
      startGame: (context, event) => {},
      generateRound: (context, event) => {},
      processGuess: (context, event) => {},
      notifyIncorrectGuess: (context, event) => {},
    },
  },
);

export const gameActor = createActor(gameMachine);
