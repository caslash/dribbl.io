import { CareerPathContext, CareerPathEvent } from '@dribblio/types';
import { assertEvent, type GuardArgs } from 'xstate';

type CareerPathGuardArgs = GuardArgs<CareerPathContext, CareerPathEvent>;

const isCorrect = ({ context, event }: CareerPathGuardArgs): boolean => {
  assertEvent(event, 'USER_GUESS');
  const { guessId } = event.guess;
  return context.gameState.validAnswers.some(
    (player) => Number(player.playerId) === Number(guessId),
  );
};

// Guards are evaluated before actions run, so "hasLives" must check whether
// lives will remain *after* the decrement action (i.e. > 1, not > 0).
const hasLives = ({ context }: CareerPathGuardArgs): boolean =>
  context.gameState.lives === undefined ? true : context.gameState.lives > 1;

const configSet = ({ context }: CareerPathGuardArgs): boolean =>
  !!context.config.gameDifficulty;

export const guards = { isCorrect, hasLives, configSet };
