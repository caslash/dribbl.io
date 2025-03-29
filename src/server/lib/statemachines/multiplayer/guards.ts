import { MultiplayerContext } from '@/server/lib/statemachines/multiplayer/gamemachine';
import { AnyEventObject } from 'xstate';

type GuardProps = {
  context: MultiplayerContext;
  event: AnyEventObject;
};

export const isCorrect = ({ context, event }: GuardProps): boolean => {
  const { guessId } = event.guess;
  return !!context.gameState.validAnswers.find((player) => player.id === guessId);
};

export const timeExpired = ({ context }: GuardProps): boolean => {
  const { timeLeft } = context.gameState;
  return timeLeft <= 0;
};
