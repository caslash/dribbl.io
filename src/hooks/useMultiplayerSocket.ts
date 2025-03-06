'use client';

import { clientSocket } from '@/app/clientSocket';
import { User } from '@/server/lib/models/room';
import { useEffect, useState } from 'react';

type RoomProps = {
  id: string;
  users: User[];
};

const useMultiplayerSocket = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [canStartGame, setCanStartGame] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [roomId, setRoomId] = useState<string | undefined>(undefined);

  // From Server
  function onRoomUpdated({ id, users }: RoomProps) {
    setRoomId(id);
    setUsers(users);
  }

  // To Server
  function onConnect() {
    setIsConnected(true);
  }
  function onDisconnect() {
    setIsConnected(false);
  }
  function onHostRoom(userName: string) {
    clientSocket.emit('host_room', true, userName);
  }
  function onJoinRoom(roomId: string, userName: string) {
    clientSocket.emit('join_room', roomId, userName);
  }

  useEffect(() => {
    setCanStartGame(false);

    clientSocket.on('connect', onConnect);
    clientSocket.on('disconnect', onDisconnect);
    clientSocket.on('room_updated', onRoomUpdated);

    clientSocket.connect();

    return () => {
      clientSocket.off('connect', onConnect);
      clientSocket.off('disconnect', onDisconnect);
      clientSocket.off('room_updated', onRoomUpdated);

      clientSocket.disconnect();
    };
  }, []);

  return {
    socketId: clientSocket.id,
    isConnected,
    roomId,
    canStartGame,
    users,
    onHostRoom,
    onJoinRoom,
  };
};

export default useMultiplayerSocket;
