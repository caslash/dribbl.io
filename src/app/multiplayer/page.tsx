'use client';

import { socket } from '@/server/lib/socket';
import { Button } from '@heroui/react';
import { useEffect, useState } from 'react';

function onWaitingForPlayers() {
  socket.emit('start_game');
}

export default function Game() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    function onConnect() {
      setIsConnected(true);
      socket.on('waiting_for_players', onWaitingForPlayers);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return (
    <div>
      <p>Status: {isConnected ? 'connected' : 'disconnected'}</p>
      <Button onPress={() => socket.connect()}>Connect</Button>
      <Button onPress={() => socket.disconnect()}>Disconnect</Button>
    </div>
  );
}
