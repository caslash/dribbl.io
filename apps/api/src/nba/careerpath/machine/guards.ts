import { CareerPathContext, CareerPathEvent } from '@dribblio/types';
import { assertEvent, type GuardArgs } from 'xstate';

type CareerPathGuardArgs = GuardArgs<CareerPathContext, CareerPathEvent>;

const isCorrect = ({ context, event }: CareerPathGuardArgs): boolean => {
  assertEvent(event, 'USER_GUESS');
  const { guessId } = event.guess;
  return context.gameState.validAnswers.some(
    (player) => Number(player.playerId) === guessId,
  );
};

const hasLives = ({ context }: CareerPathGuardArgs): boolean =>
  context.gameState.lives === undefined ? true : context.gameState.lives > 0;

const configSet = ({ context }: CareerPathGuardArgs): boolean =>
  !!context.config.gameDifficulty;

export const guards = { isCorrect, hasLives, configSet };
