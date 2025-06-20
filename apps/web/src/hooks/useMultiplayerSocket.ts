'use client';

import { clientSocket } from '@/lib/clientsocket';
import { useUser } from '@auth0/nextjs-auth0';
import { nba, users } from '@dribblio/database';
import {
  GameState,
  HostRoomMessageBody,
  JoinRoomMessageBody,
  MultiplayerConfig,
  UserGameInfo,
} from '@dribblio/types';
import { useEffect, useState } from 'react';

type RoomProps = {
  id: string;
  users: users.User[];
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

  const { user } = useUser();

  // From Server
  function onRoomUpdated({ id, users }: RoomProps) {
    setRoomId(id);
    setUsers(users.map((user: users.User) => ({ info: user, score: 0 })));
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
  function onHostRoom(config: MultiplayerConfig) {
    if (!user) return;

    const body: HostRoomMessageBody = { isMulti: true, userId: user.sub, config };
    clientSocket.emit('host_room', body);
    setCanStartGame(true);
  }
  function onJoinRoom(roomId: string) {
    if (!user) return;

    const body: JoinRoomMessageBody = { roomId, userId: user.sub };
    clientSocket.emit('join_room', body);
  }
  function onStartGame() {
    setCanStartGame(false);
    clientSocket.emit('start_game', users);
  }
  function onGuess(guessId: number) {
    if (!user) return;

    clientSocket.emit('client_guess', { userId: user.sub, guessId });
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
