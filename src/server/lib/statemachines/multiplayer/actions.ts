import { MultiplayerGuess } from '@/server/lib/models/gamemachine';
import {
  MultiplayerContext,
  UserGameInfo,
} from '@/server/lib/statemachines/multiplayer/gamemachine';
import { AnyEventObject, assign } from 'xstate';

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
};\

const updateUserScore = (users: UserGameInfo[], currentGuess: MultiplayerGuess): UserGameInfo[] => {
  const otherUsers = users.filter((user) => user.info.id != currentGuess.userId);
  const currentUser = users.find((user) => user.info.id == currentGuess.userId)!;

  return [...otherUsers, { ...currentUser, score: currentUser.score + 1 }];
};

export const checkGuess = ({ context, event }: ActionProps) => {
  const isCorrect = !!context.gameState.validAnswers.find(
    (player) => player.id === event.guess.guessId,
  );
  if (isCorrect) {
    assign({
      ...context,
      gameState: {
        ...context.gameState,
        users: updateUserScore(context.gameState.users, event.guess),
      },
    });
  }
};

export const decrementTimer = ({ context }: ActionProps) => {
  const { io, room, gameState } = context;
  const timeLeft = gameState.timeLeft - 1;

  assign({
    ...context,
    gameState: {
      ...context.gameState,
      timeLeft,
    },
  });

  io?.to(room.id).emit('timer_updated', { timeLeft });
};
