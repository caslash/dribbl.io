import { MultiplayerContext } from '@/server/lib/statemachines/multiplayer/gamemachine';
import { AnyEventObject } from 'xstate';

type ActionProps = {
  context: MultiplayerContext;
  event: AnyEventObject;
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

export const sendTimerToRoom = ({ context }: ActionProps) => {
  const { io, room, gameState } = context;
  const { timeLeft } = gameState;

  io?.to(room.id).emit('timer_updated', { timeLeft });
};
