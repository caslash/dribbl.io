'use client';

import { clientSocket } from '@/app/clientSocket';
import { useEffect, useState } from 'react';

interface StateProps {
  gameActive?: string;
}

interface RoundProps {
  round: number;
  score: number;
  team_history: string[];
}

const useClientSocket = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [canStartGame, setCanStartGame] = useState<boolean>(false);
  const [machineState, setMachineState] = useState<string>('idle');

  const [round, setRound] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [teams, setTeams] = useState<string[] | null>(null);

  // From Server
  function onStateChange({ gameActive }: StateProps) {
    setMachineState(gameActive ?? 'idle');
  }
  function onWaitingForPlayers() {
    setCanStartGame(true);
  }
  function onNextRound({ round, score, team_history }: RoundProps) {
    setRound(round);
    setScore(score);
    setTeams(team_history);
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

  useEffect(() => {
    setCanStartGame(false);

    clientSocket.on('connect', onConnect);
    clientSocket.on('disconnect', onDisconnect);
    clientSocket.on('waiting_for_players', onWaitingForPlayers);
    clientSocket.on('state_change', onStateChange);
    clientSocket.on('next_round', onNextRound);

    clientSocket.connect();

    return () => {
      clientSocket.off('connect', onConnect);
      clientSocket.off('disconnect', onDisconnect);
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
    onGuess,
  };
};

export default useClientSocket;
