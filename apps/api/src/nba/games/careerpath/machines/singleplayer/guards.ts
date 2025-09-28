import { SinglePlayerContext } from '@dribblio/types';
import { AnyEventObject } from 'xstate';

type GuardProps = {
  context: SinglePlayerContext;
  event: AnyEventObject;
};

export const isCorrectSinglePlayer = ({ context, event }: GuardProps): boolean => {
  const { guessId } = event.guess;
  return !!context.gameState.validAnswers.find((player) => player.id === guessId);
};

export const hasLives = ({ context }: GuardProps): boolean =>
  context.gameState.lives ? context.gameState.lives > 0 : true;
