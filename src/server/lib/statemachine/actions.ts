import { Player } from '@prisma/client';
import { DefaultEventsMap, Socket } from 'socket.io';

type ActionProps = {
  context: {
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> | undefined;
    gameState: {
      round: number;
      score: number;
      currentPlayer: Player | undefined;
      validAnswers: Player[];
    };
  };
};

export const waitForPlayers = ({ context }: ActionProps) => {
  const { socket } = context;
  socket ? socket.emit('waiting_for_players') : Error('Socket could not be found.');
};

export const sendPlayerToClient = ({ context }: ActionProps) => {
  const { socket, gameState } = context;
  const { round, score, currentPlayer } = gameState;

  const team_history = currentPlayer?.team_history?.split(',');

  socket
    ? socket.emit('next_round', { round, score, team_history })
    : Error('Socket could not be found');
};

export const notifyCorrectGuess = ({ context }: ActionProps) => {
  const { socket, gameState } = context;
  const { validAnswers } = gameState;

  socket ? socket.emit('correct_guess', { validAnswers }) : Error('Socket could not be found');
};

export const notifyIncorrectGuess = ({ context }: ActionProps) => {
  const { socket } = context;
  socket ? socket.emit('incorrect_guess') : Error('Socket could not be found');
};
