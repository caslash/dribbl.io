import { MultiplayerContext } from '@/server/lib/statemachines/multiplayer/gamemachine';
import { AnyEventObject } from 'xstate';

type ActionProps = {
  context: MultiplayerContext;
  event: AnyEventObject;
};

export const sendPlayerToRoom = ({ context }: ActionProps) => {
  try {
    const { io, room, gameState } = context;
    const { roundActive, timeLeft, users, validAnswers } = gameState;

    const team_history = validAnswers[0]?.team_history?.split(',');

    io?.to(room.id).emit('next_round', { roundActive, timeLeft, users, team_history });
  } catch (err) {
    throw Error(`Socket could not be found: ${err}`);
  }
};

export const sendTimerToRoom = ({ context }: ActionProps) => {
  const { io, room, gameState } = context;
  const { timeLeft } = gameState;

  io?.to(room.id).emit('timer_updated', { timeLeft });
};

export const sendRoundInfoToRoom = ({ context }: ActionProps) => {
  const { io, room, gameState } = context;

  io?.to(room.id).emit('end_round', gameState);
};
