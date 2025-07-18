import { AnyEventObject } from 'xstate';
import { SinglePlayerContext } from './gamemachine.js';

type ActionProps = {
  context: SinglePlayerContext;
  event: AnyEventObject;
};

export const waitForUser = ({ context }: ActionProps) => {
  try {
    const { socket } = context;

    socket?.emit('waiting_for_user');
  } catch (err) {
    throw Error(`Socket could not be found: ${err}`);
  }
};

export const sendPlayerToClient = ({ context }: ActionProps) => {
  try {
    const { socket, gameState } = context;
    const { score, validAnswers, lives } = gameState;

    const team_history = validAnswers[0]?.team_history?.split(',');

    socket?.emit('next_round', { score, team_history, lives: lives ? lives + 1 : undefined });
  } catch (err) {
    throw Error(`Socket could not be found: ${err}`);
  }
};

export const notifyCorrectGuess = ({ context }: ActionProps) => {
  try {
    const { socket, gameState } = context;
    const { validAnswers } = gameState;

    socket?.emit('correct_guess', { validAnswers });
  } catch (err) {
    throw Error(`Socket could not be found: ${err}`);
  }
};

export const notifyIncorrectGuess = ({ context }: ActionProps) => {
  try {
    const { socket, gameState } = context;
    const { lives } = gameState;

    socket?.emit('incorrect_guess', { lives: lives ? lives + 1 : undefined });
  } catch (err) {
    throw Error(`Socket could not be found: ${err}`);
  }
};

export const notifySkipRound = ({ context }: ActionProps) => {
  try {
    const { socket, gameState } = context;
    const { lives } = gameState;

    socket?.emit('round_skipped', { lives: lives ? lives + 1 : undefined });
  } catch (err) {
    throw Error(`Socket could not be found: ${err}`);
  }
};

export const notifyGameOver = ({ context }: ActionProps) => {
  try {
    const { socket } = context;

    socket?.emit('game_over');
  } catch (err) {
    throw Error(`Socket could not be found: ${err}`);
  }
};
