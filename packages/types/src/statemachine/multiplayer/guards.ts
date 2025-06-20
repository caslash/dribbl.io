import { AnyEventObject } from 'xstate';
import { MultiplayerContext } from './gamemachine.js';

type GuardProps = {
  context: MultiplayerContext;
  event: AnyEventObject;
};

export const isCorrectMultiplayer = ({ context, event }: GuardProps): boolean => {
  const { guessId } = event.guess;
  return !!context.gameState.validAnswers.find((player) => player.id === guessId);
};

export const timeExpired = ({ context }: GuardProps): boolean => {
  const { timeLeft } = context.gameState;
  return timeLeft <= 0;
};
