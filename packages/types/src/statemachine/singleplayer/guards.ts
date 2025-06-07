import { AnyEventObject } from 'xstate';
import { SinglePlayerContext } from './gamemachine.js';

type GuardProps = {
  context: SinglePlayerContext;
  event: AnyEventObject;
};

export const isCorrectSinglePlayer = ({ context, event }: GuardProps): boolean => {
  const { guessId } = event.guess;
  return !!context.gameState.validAnswers.find((player) => player.id === guessId);
};

export const hasLives = ({ context }: GuardProps): boolean => context.gameState.lives > 0;
