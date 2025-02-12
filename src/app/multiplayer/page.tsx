'use client';

import { clientSocket } from '@/app/clientSocket';
import { Button } from '@heroui/react';
import { useEffect, useState } from 'react';

interface StateProps {
  gameActive?: string;
}

export default function Game() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [currentState, setCurrentState] = useState<string>('idle');
  const [canStartGame, setCanStartGame] = useState<boolean>(false);

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
    clientSocket.emit('start_game');
  }

  useEffect(() => {
    setCanStartGame(false);

    clientSocket.on('connect', onConnect);
    clientSocket.on('disconnect', onDisconnect);
    clientSocket.on('waiting_for_players', onWaitingForPlayers);
    clientSocket.on('state_change', onStateChange);

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
          <Button onPress={onStartGame} isDisabled={!canStartGame}>
            Start Game
          </Button>

          <Button onPress={() => clientSocket.disconnect()}>Disconnect</Button>
        </div>
      )}
    </div>
  );
}
