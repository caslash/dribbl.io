'use client';

import { clientSocket } from '@/app/clientSocket';
import { Player } from '@prisma/client';
import { useEffect, useState } from 'react';

type ClientSocketProps = {
  correctAction: (validAnswers: Player[]) => void;
  incorrectAction: () => void;
};

type StateProps = {
  gameActive?: string;
};

type RoundProps = {
  score: number;
  team_history: string[];
  lives: number;
};

type CorrectGuessProps = {
  validAnswers: Player[];
};

type IncorrectGuessProps = {
  lives: number;
};

const useClientSocket = ({ correctAction, incorrectAction }: ClientSocketProps) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [canStartGame, setCanStartGame] = useState<boolean>(false);
  const [machineState, setMachineState] = useState<string>('idle');

  const [score, setScore] = useState<number>(0);
  const [teams, setTeams] = useState<string[] | null>(null);
  const [lives, setLives] = useState<number>(0);

  // From Server
  function onStateChange({ gameActive }: StateProps) {
    setMachineState(gameActive ?? 'idle');
  }
  function onWaitingForUser() {
    setCanStartGame(true);
  }
  function onNextRound({ score, team_history, lives }: RoundProps) {
    setScore(score);
    setTeams(team_history);
    setLives(lives);
  }
  function onCorrectGuess({ validAnswers }: CorrectGuessProps) {
    correctAction(validAnswers);
  }
  function onIncorrectGuess({ lives }: IncorrectGuessProps) {
    setLives(lives);
    incorrectAction();
  }
  function onSkipped({ lives }: IncorrectGuessProps) {
    setLives(lives);
  }
  function onGameOver() {
    setCanStartGame(true);
    setScore(0);
    setTeams(null);
  }

  // To Server
  function onConnect() {
    setIsConnected(true);
  }
  function onDisconnect() {
    setIsConnected(false);
    setMachineState('idle');
    setScore(0);
    setTeams(null);
  }
  function onStartGame() {
    setCanStartGame(false);
    clientSocket.emit('start_game');
  }
  function onGuess(playerId: number) {
    clientSocket.emit('client_guess', playerId);
  }
  function onSkip() {
    clientSocket.emit('skip_round');
  }

  useEffect(() => {
    setCanStartGame(false);

    clientSocket.on('connect', onConnect);
    clientSocket.on('disconnect', onDisconnect);
    clientSocket.on('waiting_for_user', onWaitingForUser);
    clientSocket.on('state_change', onStateChange);
    clientSocket.on('correct_guess', onCorrectGuess);
    clientSocket.on('incorrect_guess', onIncorrectGuess);
    clientSocket.on('round_skipped', onSkipped);
    clientSocket.on('next_round', onNextRound);
    clientSocket.on('game_over', onGameOver);

    clientSocket.connect();

    return () => {
      clientSocket.off('connect', onConnect);
      clientSocket.off('disconnect', onDisconnect);
      clientSocket.off('waiting_for_user', onWaitingForUser);
      clientSocket.off('state_change', onStateChange);
      clientSocket.off('correct_guess', onCorrectGuess);
      clientSocket.off('incorrect_guess', onIncorrectGuess);
      clientSocket.off('round_skipped', onSkipped);
      clientSocket.off('next_round', onNextRound);
      clientSocket.off('game_over', onGameOver);

      clientSocket.disconnect();
    };
  }, []);

  return {
    isConnected,
    canStartGame,
    onStartGame,
    machineState,
    score,
    teams,
    lives,
    onGuess,
    onSkip,
  };
};

export default useClientSocket;
