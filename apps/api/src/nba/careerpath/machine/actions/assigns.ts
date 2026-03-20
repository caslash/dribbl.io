import { RoundProps } from '@/nba/careerpath/machine/actors/generate-round';
import {
  CareerPathContext,
  CareerPathEvent,
  GameDifficulties,
  Player,
} from '@dribblio/types';
import { assertEvent, assign, DoneActorEvent } from 'xstate';

// Typed assign helper — define once, reuse for all context-mutation actions.
const careerPathAssign = assign<
  CareerPathContext,
  CareerPathEvent,
  undefined,
  CareerPathEvent,
  never
>;

const assignConfig = careerPathAssign(({ event }) => {
  assertEvent(event, 'SAVE_CONFIG');
  const difficulty =
    GameDifficulties.allModes.find(
      (gd) => gd.name == event.config.gameDifficulty,
    ) ?? GameDifficulties.greatest75;
  return { config: { lives: event.config.lives, gameDifficulty: difficulty } };
});

const assignRoundGenerated = careerPathAssign(({ context, event }) => {
  const doneEvent = event as unknown as DoneActorEvent<RoundProps>;
  return {
    gameState: {
      ...context.gameState,
      validAnswers: doneEvent.output.validAnswers,
    },
  };
});

const assignCorrectGuess = careerPathAssign(({ context }) => ({
  gameState: {
    ...context.gameState,
    score: context.gameState.score + 1,
  },
}));

const assignIncorrectGuess = careerPathAssign(({ context }) => ({
  gameState: {
    ...context.gameState,
    lives: context.gameState.lives ? context.gameState.lives - 1 : undefined,
    score: !context.config.lives ? 0 : context.gameState.score,
  },
}));

const assignSkipRound = careerPathAssign(({ context }) => ({
  gameState: {
    ...context.gameState,
    lives: context.gameState.lives ? context.gameState.lives - 1 : undefined,
    score: context.config.lives ? context.gameState.score : 0,
  },
}));

const assignGameStart = careerPathAssign(({ context }) => ({
  gameState: {
    score: 0,
    validAnswers: [] as Player[],
    lives: context.config.lives,
  },
}));

export const assignActions = {
  assignConfig,
  assignRoundGenerated,
  assignCorrectGuess,
  assignIncorrectGuess,
  assignSkipRound,
  assignGameStart,
};
