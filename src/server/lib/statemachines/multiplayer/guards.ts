import { MultiplayerGuess } from '@/server/lib/models/gamemachine';
import { Room } from '@/server/lib/models/room';
import { UserGameInfo } from '@/server/lib/statemachines/multiplayer/gamemachine';
import { Player } from '@prisma/client';
import { Server } from 'socket.io';
import { AnyEventObject } from 'xstate';

type GuardProps = {
  context: {
    io: Server;
    room: Room;
    gameState: {
      currentGuess: MultiplayerGuess | undefined;
      users: UserGameInfo[];
      currentPlayer: Player | undefined;
      validAnswers: Player[];
    };
  };
  event: AnyEventObject;
};

export const isCorrect = ({ context }: GuardProps): boolean => {
  const { guessId } = context.gameState.currentGuess!;
  return !!context.gameState.validAnswers.find((player) => player.id === guessId);
};
