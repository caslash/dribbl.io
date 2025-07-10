'use client';

import { singlePlayerSocket as clientSocket } from '@/lib/clientsocket';
import { nba } from '@dribblio/database';
import { SinglePlayerConfig } from '@dribblio/types';
import { useEffect, useState } from 'react';

type ClientSocketProps = {
  correctAction: (validAnswers: nba.Player[]) => void;
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
  validAnswers: nba.Player[];
};

type IncorrectGuessProps = {
  lives: number;
};

const useSinglePlayerSocket = ({ correctAction, incorrectAction }: ClientSocketProps) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isRoomConfigured, setIsRoomConfigured] = useState<boolean>(false);
  const [canStartGame, setCanStartGame] = useState<boolean>(true);
  const [machineState, setMachineState] = useState<string>('waitingForGameStart');

  const [score, setScore] = useState<number>(0);
  const [teams, setTeams] = useState<string[] | null>(null);
  const [lives, setLives] = useState<number | undefined>(undefined);

  // From Server
  function onStateChange({ gameActive }: StateProps) {
    setMachineState(gameActive ?? 'waitingForGameStart');
  }
  function onNextRound({ score, team_history, lives }: RoundProps) {
    setScore(score);
    setTeams(team_history);
    setLives(lives);
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
    setCanStartGame(true);
  }
  function onDisconnect() {
    setIsConnected(false);
    setMachineState('waitingForGameStart');
    setScore(0);
    setTeams(null);
  }
  function onConfigureRoom(config: SinglePlayerConfig) {
    clientSocket.emit('create_game', config);
    setIsRoomConfigured(true);
  }
  function onStartGame() {
    setCanStartGame(false);
    clientSocket.emit('start_game');
  }
  function onGuess(guessId: number) {
    clientSocket.emit('client_guess', { userId: '', guessId });
  }
  function onSkip() {
    clientSocket.emit('skip_round');
  }

  useEffect(() => {
    function onCorrectGuess({ validAnswers }: CorrectGuessProps) {
      correctAction(validAnswers);
    }
    function onIncorrectGuess({ lives }: IncorrectGuessProps) {
      setLives(lives);
      incorrectAction();
    }

    setCanStartGame(false);

    clientSocket.on('connect', onConnect);
    clientSocket.on('disconnect', onDisconnect);
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
    isRoomConfigured,
    onConfigureRoom,
    onStartGame,
    machineState,
    score,
    teams,
    lives,
    onGuess,
    onSkip,
  };
};

export default useSinglePlayerSocket;
