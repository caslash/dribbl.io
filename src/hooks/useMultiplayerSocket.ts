'use client';

import { clientSocket } from '@/app/clientSocket';
import { User } from '@/server/lib/models/room';
import { UserGameInfo } from '@/server/lib/multiplayer/statemachine';
import { Player } from '@prisma/client';
import { useEffect, useState } from 'react';

type RoomProps = {
  id: string;
  users: User[];
};

type RoundProps = {
  users: UserGameInfo[];
  team_history: string[];
  players: Player[];
};

const useMultiplayerSocket = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [canStartGame, setCanStartGame] = useState<boolean>(false);
  const [users, setUsers] = useState<UserGameInfo[]>([]);
  const [roomId, setRoomId] = useState<string | undefined>(undefined);

  const [teams, setTeams] = useState<string[] | null>(null);

  const [players, setPlayers] = useState<Player[]>([]);

  // From Server
  function onRoomUpdated({ id, users }: RoomProps) {
    setRoomId(id);
    setUsers(users.map((user: User) => ({ info: user, score: 0 })));
  }
  function onNextRound({ team_history, users, players }: RoundProps) {
    setUsers(users);
    setTeams(team_history);
    setPlayers(players);
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
    setCanStartGame(true);
  }
  function onJoinRoom(roomId: string, userName: string) {
    clientSocket.emit('join_room', roomId, userName);
  }
  function onStartGame() {
    setCanStartGame(false);
    clientSocket.emit('start_game', users);
  }

  useEffect(() => {
    setCanStartGame(false);

    clientSocket.on('connect', onConnect);
    clientSocket.on('disconnect', onDisconnect);
    clientSocket.on('room_updated', onRoomUpdated);
    clientSocket.on('next_round', onNextRound);

    clientSocket.connect();

    return () => {
      clientSocket.off('connect', onConnect);
      clientSocket.off('disconnect', onDisconnect);
      clientSocket.off('room_updated', onRoomUpdated);
      clientSocket.off('next_round', onNextRound);

      clientSocket.disconnect();
    };
  }, []);

  return {
    socketId: clientSocket.id,
    isConnected,
    roomId,
    canStartGame,
    onStartGame,
    users,
    onHostRoom,
    onJoinRoom,
    teams,
    players,
  };
};

export default useMultiplayerSocket;
