import { Player } from '@prisma/client';
import { DefaultEventsMap, Socket } from 'socket.io';
import { AnyEventObject } from 'xstate';

type GuardProps = {
  context: {
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> | undefined;
    gameState: {
      score: number;
      currentPlayer: Player | undefined;
      validAnswers: Player[];
      lives: number;
    };
  };
  event: AnyEventObject;
};

export const isCorrect = ({ context, event }: GuardProps): boolean => {
  const { guessId } = event;
  return !!context.gameState.validAnswers.find((player) => player.id === guessId);
};

export const hasLives = ({ context }: GuardProps): boolean => context.gameState.lives > 0;
