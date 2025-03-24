import { Room } from '@/server/lib/models/room';
import { UserGameInfo } from '@/server/lib/multiplayer/gamemachine';
import { Player } from '@prisma/client';
import { Server } from 'socket.io';

type ActionProps = {
  context: {
    io: Server;
    room: Room;
    gameState: {
      users: UserGameInfo[];
      currentPlayer: Player | undefined;
      validAnswers: Player[];
    };
  };
};

export const sendPlayerToRoom = ({ context }: ActionProps) => {
  try {
    const { io, room, gameState } = context;
    const { users, currentPlayer } = gameState;

    const team_history = currentPlayer?.team_history?.split(',');

    io?.to(room.id).emit('next_round', { users, team_history });
  } catch (err) {
    throw Error(`Socket could not be found: ${err}`);
  }
};
