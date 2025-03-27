import { MultiplayerContext } from '@/server/lib/statemachines/multiplayer/gamemachine';
import { AnyEventObject } from 'xstate';

type GuardProps = {
  context: MultiplayerContext;
  event: AnyEventObject;
};

export const isCorrect = ({ context }: GuardProps): boolean => {
  const { guessId } = context.gameState.currentGuess!;
  return !!context.gameState.validAnswers.find((player) => player.id === guessId);
};

export const timeExpired = ({ context }: GuardProps): boolean => {
  return true;
};
