import { Player } from '@prisma/client';
import { DefaultEventsMap, Socket } from 'socket.io';
import { AnyEventObject } from 'xstate';

type GuardProps = {
  context: {
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> | undefined;
    gameState: {
      round: number;
      score: number;
      currentPlayer: Player | undefined;
      validAnswers: Player[];
    };
  };
  event: AnyEventObject;
};

export const isCorrect = ({ context, event }: GuardProps): boolean => {
  const { guessId } = event;
  return context.gameState.validAnswers.find((player) => player.id === guessId) ? true : false;
};
