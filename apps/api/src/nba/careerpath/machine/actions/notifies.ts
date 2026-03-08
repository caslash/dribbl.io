import { socketActor } from '@/nba/careerpath/machine/actors/websocket';
import { CareerPathContext, CareerPathEvent } from '@dribblio/types';
import { ActorRefFrom, sendTo } from 'xstate';

type SocketRef = ActorRefFrom<typeof socketActor>;

const sendToSocket = sendTo<
  CareerPathContext,
  CareerPathEvent,
  undefined,
  SocketRef,
  CareerPathEvent
>;

const notifyNextRound = sendToSocket('socket', ({ context }) => ({
  type: 'NOTIFY_NEXT_ROUND',
  score: context.gameState.score,
  team_history: context.gameState.validAnswers[0]?.seasons
    .map((s) => String(s.teamId))
    .filter((id) => id !== null),
  lives: context.gameState.lives ? context.gameState.lives + 1 : undefined,
}));

const notifyConfigSaved = sendToSocket('socket', () => ({
  type: 'NOTIFY_CONFIG_SAVED',
}));

const notifyCorrectGuess = sendToSocket('socket', ({ context }) => ({
  type: 'NOTIFY_CORRECT_GUESS',
  validAnswers: context.gameState.validAnswers,
}));

const notifyIncorrectGuess = sendToSocket('socket', ({ context }) => ({
  type: 'NOTIFY_INCORRECT_GUESS',
  lives: context.gameState.lives ? context.gameState.lives + 1 : undefined,
}));

const notifySkipRound = sendToSocket('socket', ({ context }) => ({
  type: 'NOTIFY_SKIP_ROUND',
  lives: context.gameState.lives ? context.gameState.lives + 1 : undefined,
}));

const notifyGameOver = sendToSocket('socket', () => ({
  type: 'NOTIFY_GAME_OVER',
}));

export const notifyActions = {
  notifyNextRound,
  notifyConfigSaved,
  notifyCorrectGuess,
  notifyIncorrectGuess,
  notifySkipRound,
  notifyGameOver,
};
