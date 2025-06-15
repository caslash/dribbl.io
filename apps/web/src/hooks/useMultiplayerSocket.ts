'use client';

import { clientSocket } from '@/lib/clientsocket';
import { nba } from '@dribblio/database';
import {
  GameState,
  HostRoomMessageBody,
  JoinRoomMessageBody,
  MultiplayerConfig,
  User,
  UserGameInfo,
} from '@dribblio/types';
import { useEffect, useState } from 'react';

type RoomProps = {
  id: string;
  users: User[];
};

type RoundProps = {
  roundActive: boolean;
  timeLeft: number;
  users: UserGameInfo[];
  team_history: string[];
  players: nba.Player[];
};

const useMultiplayerSocket = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [canStartGame, setCanStartGame] = useState<boolean>(false);

  const [roundActive, setRoundActive] = useState<boolean>(false);
  const [users, setUsers] = useState<UserGameInfo[]>([]);
  const [roomId, setRoomId] = useState<string | undefined>(undefined);
  const [validAnswers, setValidAnswers] = useState<nba.Player[]>([]);

  const [teams, setTeams] = useState<string[] | null>(null);

  const [players, setPlayers] = useState<nba.Player[]>([]);

  const [timeLeft, setTimeLeft] = useState<number>(0);

  // From Server
  function onRoomUpdated({ id, users }: RoomProps) {
    setRoomId(id);
    setUsers(users.map((user: User) => ({ info: user, score: 0 })));
  }
  function onNextRound({ roundActive, timeLeft, team_history, users, players }: RoundProps) {
    setRoundActive(roundActive);
    setTimeLeft(timeLeft);
    setUsers(users);
    setTeams(team_history);
    setPlayers(players);
  }
  function onTimerUpdated({ timeLeft }: { timeLeft: number }) {
    setTimeLeft(timeLeft);
  }
  function onEndRound({ roundActive, users, validAnswers }: GameState) {
    setRoundActive(roundActive);
    setUsers(users);
    setValidAnswers(validAnswers);
  }

  // To Server
  function onConnect() {
    setIsConnected(true);
  }
  function onDisconnect() {
    setIsConnected(false);
  }
  function onHostRoom(userName: string, config: MultiplayerConfig) {
    const body: HostRoomMessageBody = { isMulti: true, userName, config };
    clientSocket.emit('host_room', body);
    setCanStartGame(true);
  }
  function onJoinRoom(roomId: string, userName: string) {
    const body: JoinRoomMessageBody = { roomId, userName };
    clientSocket.emit('join_room', body);
  }
  function onStartGame() {
    setCanStartGame(false);
    clientSocket.emit('start_game', users);
  }
  function onGuess(playerId: number) {
    clientSocket.emit('client_guess', playerId);
  }

  useEffect(() => {
    setCanStartGame(false);

    clientSocket.on('connect', onConnect);
    clientSocket.on('disconnect', onDisconnect);
    clientSocket.on('room_updated', onRoomUpdated);
    clientSocket.on('next_round', onNextRound);
    clientSocket.on('timer_updated', onTimerUpdated);
    clientSocket.on('end_round', onEndRound);

    clientSocket.connect();

    return () => {
      clientSocket.off('connect', onConnect);
      clientSocket.off('disconnect', onDisconnect);
      clientSocket.off('room_updated', onRoomUpdated);
      clientSocket.off('next_round', onNextRound);
      clientSocket.off('timer_updated', onTimerUpdated);
      clientSocket.off('end_round', onEndRound);
      clientSocket.disconnect();
    };
  }, []);

  return {
    socketId: clientSocket.id,
    isConnected,
    roundActive,
    roomId,
    canStartGame,
    onStartGame,
    users,
    onHostRoom,
    onJoinRoom,
    teams,
    players,
    onGuess,
    timeLeft,
    validAnswers,
  };
};

export default useMultiplayerSocket;
