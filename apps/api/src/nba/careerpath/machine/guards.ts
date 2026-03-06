import { CareerPathContext, CareerPathEvent } from '@dribblio/types';
import type { GuardArgs } from 'xstate';

type SinglePlayerGuardArgs = GuardArgs<CareerPathContext, CareerPathEvent>;

const isCorrectSinglePlayer = ({
  context,
  event,
}: SinglePlayerGuardArgs): boolean => {
  if (event.type !== 'USER_GUESS') return false;
  const { guessId } = event.guess;
  return !!context.gameState.validAnswers.some(
    (player) => player.playerId === guessId,
  );
};

const hasLives = ({ context }: SinglePlayerGuardArgs): boolean =>
  context.gameState.lives ? context.gameState.lives > 0 : true;

export const guards = { isCorrectSinglePlayer, hasLives };
