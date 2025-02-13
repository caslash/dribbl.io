'use client';

import { clientSocket } from '@/app/clientSocket';
import { Button } from '@heroui/react';
import { useEffect, useState } from 'react';
import { v4 } from 'uuid';

interface StateProps {
  gameActive?: string;
}

interface RoundProps {
  round: number;
  score: number;
  team_history: string[];
}

export default function Game() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [currentState, setCurrentState] = useState<string>('idle');
  const [canStartGame, setCanStartGame] = useState<boolean>(false);

  const [currentRound, setCurrentRound] = useState<number>(0);
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [currentPlayerTeams, setCurrentPlayerTeams] = useState<string[]>([]);

  function onConnect() {
    setIsConnected(true);
  }
  function onDisconnect() {
    setIsConnected(false);
    setCurrentState('idle');
  }
  function onWaitingForPlayers() {
    setCanStartGame(true);
  }
  function onStateChange({ gameActive }: StateProps) {
    setCurrentState(gameActive ?? 'idle');
  }
  function onStartGame() {
    setCanStartGame(false);
    clientSocket.emit('start_game');
  }
  function onNextRound({ round, score, team_history }: RoundProps) {
    setCurrentRound(round);
    setCurrentScore(score);
    setCurrentPlayerTeams(team_history);
  }

  useEffect(() => {
    setCanStartGame(false);

    clientSocket.on('connect', onConnect);
    clientSocket.on('disconnect', onDisconnect);
    clientSocket.on('waiting_for_players', onWaitingForPlayers);
    clientSocket.on('state_change', onStateChange);
    clientSocket.on('next_round', onNextRound);

    return () => {
      clientSocket.off('connect', onConnect);
      clientSocket.off('disconnect', onDisconnect);
      clientSocket.disconnect();
    };
  }, []);

  return (
    <div>
      <p>Status: {isConnected ? 'connected' : 'disconnected'}</p>
      <p>State: {currentState}</p>
      {!isConnected && <Button onPress={() => clientSocket.connect()}>Connect</Button>}
      {isConnected && (
        <div>
          {canStartGame && <Button onPress={onStartGame}>Start Game</Button>}

          <Button onPress={() => clientSocket.disconnect()}>Disconnect</Button>
        </div>
      )}

      <p>Round: {currentRound}</p>
      <p>Score: {currentScore}</p>
      {currentPlayerTeams.map((team) => (
        <p key={v4()}>{team}</p>
      ))}
    </div>
  );
}
