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
  round: number;
  score: number;
  team_history: string[];
  lives: number;
};

type CorrectGuessProps = {
  validAnswers: Player[];
};

const useClientSocket = ({ correctAction, incorrectAction }: ClientSocketProps) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [canStartGame, setCanStartGame] = useState<boolean>(false);
  const [machineState, setMachineState] = useState<string>('idle');

  const [round, setRound] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [teams, setTeams] = useState<string[] | null>(null);
  const [lives, setLives] = useState<number>(0);

  // From Server
  function onStateChange({ gameActive }: StateProps) {
    setMachineState(gameActive ?? 'idle');
  }
  function onWaitingForPlayers() {
    setCanStartGame(true);
  }
  function onNextRound({ round, score, team_history, lives }: RoundProps) {
    setRound(round);
    setScore(score);
    setTeams(team_history);
    setLives(lives);
  }
  function onCorrectGuess({ validAnswers }: CorrectGuessProps) {
    correctAction(validAnswers);
  }
  function onGameOver() {
    setRound(0);
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
    setRound(0);
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
    clientSocket.on('waiting_for_players', onWaitingForPlayers);
    clientSocket.on('state_change', onStateChange);
    clientSocket.on('correct_guess', onCorrectGuess);
    clientSocket.on('incorrect_guess', incorrectAction);
    clientSocket.on('next_round', onNextRound);
    clientSocket.on('game_over', onGameOver);

    clientSocket.connect();

    return () => {
      clientSocket.off('connect', onConnect);
      clientSocket.off('disconnect', onDisconnect);
      clientSocket.off('waiting_for_players', onWaitingForPlayers);
      clientSocket.off('state_change', onStateChange);
      clientSocket.off('correct_guess', onCorrectGuess);
      clientSocket.off('incorrect_guess', incorrectAction);
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
    round,
    score,
    teams,
    lives,
    onGuess,
    onSkip,
  };
};

export default useClientSocket;
