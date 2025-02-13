import { createActor, enqueueActions, fromPromise, setup } from 'xstate';
import { getRandomPlayer } from '../actions';

export const gameMachine = setup({
  actions: {
    waitForPlayers: ({ context }) => {
      console.log('WAITING FOR PLAYERS');
      const { socket } = context;

      socket.emit('waiting_for_players');
    },
    sendPlayerToClient: ({ context }) => {
      const { socket, gameState } = context;
      const { round, score, currentPlayer } = gameState;

      const team_history = currentPlayer.team_history.split(',');

      socket.emit('next_round', { round, score, team_history });
    },
  },
  actors: {
    generateRound: fromPromise(async ({ input }) => {
      return await getRandomPlayer();
    }),
    processGuess: fromPromise(async ({ input }) => {}),
    notifyCorrectGuess: fromPromise(async ({ input }) => {}),
    notifyIncorrectGuess: fromPromise(async ({ input }) => {}),
  },
  guards: {
    isCorrect: ({ context, event }) => {
      //Do something
      return true;
    },
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QHECGBbMACAsqgxgBYCWAdmAHTEQA2YAxAMIDyAcqwKKMAqA2gAwBdRKAAOAe1jEALsXGkRIAB6IAnAFYKADgAsO9eq0B2AMwAmM6p2mANCACeiEztUUTARneqj7swDYzFwCTAF8QuzRMXAIScgooDDAAQXxZADcGABEASQBlFnYuPiFFCSlZeUUVBHcTfgpVRsbDM3U-I35+PztHBEDNfi0TOq11DVU-drCIxOiiMkoEzBT0ygB3VBkAMXEAJwAFGlR7MF3YelzuJIAlYuEkEDKZOQUH6vUvCn91Ixc2j8CRh6iHUOhMDUao18ugMemmIEi2Dw8ziS2SqWIGQosGkqF2slIUER9AE9zEkmelTeiF0fgo-CMWjMphMqkG7n0wIQoM0LlUWgZfh0Wm8GnhiLmsUWiRWmMWYHIu1QBKg13EAFdSBB6BB5JQyGlxABrSgS5FS+IyjFYmCK5VkVUarUIA3ifD2+Sk0mlCkVV6gaq1VkUfTmLSjYaMkxcsFmNxtIxmdyGRNJ9x+cWzc0LS3La3rTbSHa7ZDquDnRgAGWyHFY3AA+sgAKocXK5b0PJ5+qqIWp+Vz8nR+fjWLxM-jqLnJ9z0zqdIZ+LymEeZqLZ1FW1YUUS7N3lh2l8skkqd30vHvcz7fX4aPwA6wxnT1G8aLyGMZg9SrpExHNo2VYjue6wFIhKHiBJLuGSjxnlSAYgled43v8vgPg4iCWEYs6dLUvgAhY36Sn+m5yhQ+B7LsYCpOB5wduS5TntSCC0vSjLMsMbJaByk7oQgYIDk0lj8mY-AmKChHrtKeZbmQ5G7JR1FlhBupxK6JoUGav4btJpGyRRVHSDRLqkIa7p+l6J70ZS-rKL27hdF8XE6Om3iWPZWhcpYdKtJ0jKmImbRhOEICkOIEBwIomkomAPoMXBtkIAAtN0vGJWY4JNPyvzuFofgmL8WgSVp+q0DFp5xTZ1Q6GYnkfBQ6aTGJdRWOY7hFdFuboqssXWRezKaGyeWMr4nRgh5vF5RQ6hzs4Bi+AEE46O1Fr-vmFAbNseyHMcpzwOVvVMc4cY+OGvxDfwnigly6giRC-KqK0qgcoyS3BVFK0kViOJ4iqiI9d2TF+Ey9X8BoE5WM5Jj9tdt1NCKj3Pboy3ETpNoKqc9qEmqmoQP9jHwTUngzmYTkuYmT2DDGdRTUM-hWEYd4BKoyPaV1pEbUWew0Xj8WBqC4L5R8UaTKCzKed4FAvqOGh6B8LNSWzgG7vg+5gUpe1WQDBPmBlXT5VxIkjiY429MmrjGH8Q764Cr0zGuxWdQBlByQphnqzzlWIEDcb2WDH6Q9DvHOZo004S4-RHfLjtrXp8kGdz+1awlLEMkyLKcdxnk+JLfLhtN6X9mYQUhEAA */
  id: 'Game Machine',
  initial: 'idle',
  states: {
    idle: {
      on: {
        CONNECT: 'gameActive',
      },
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
          entry: enqueueActions(({ enqueue }) => {
            enqueue.assign({ gameState: { round: 0, score: 0, currentPlayer: undefined } });
          }),
          always: { target: 'generatingRound' },
        },
        generatingRound: {
          invoke: {
            src: 'generateRound',
            onDone: {
              target: 'waitForGuess',
              actions: enqueueActions(({ event, enqueue }) => {
                enqueue.assign(({ context, event }) => {
                  return {
                    gameState: {
                      round: context.gameState.round + 1,
                      score: context.gameState.score,
                      currentPlayer: event.output,
                    },
                  };
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
          entry: enqueueActions(({ enqueue }) => {}),
          always: { target: 'generatingRound' },
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

export const gameActor = createActor(gameMachine);
