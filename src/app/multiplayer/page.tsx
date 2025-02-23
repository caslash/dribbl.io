'use client';

import { CorrectAnswer } from '@/components/careerpath/answer';
import { CareerPath } from '@/components/careerpath/careerpathview';
import PlayerSearchBar from '@/components/search/playersearchbar';
import useClientSocket from '@/hooks/useClientSocket';
import useConfetti from '@/hooks/useConfetti';
import usePlayerSearch from '@/hooks/usePlayerSearch';
import { Button } from '@heroui/react';
import { Player } from '@prisma/client';
import { useTheme } from 'next-themes';
import { toast } from 'react-toastify';

export default function Game() {
  const { theme } = useTheme();
  const { onConfetti } = useConfetti();
  const correctAction = (validAnswers: Player[]) => {
    toast(<CorrectAnswer validAnswers={validAnswers} />, { theme });
    onConfetti();
  };
  const incorrectAction = () => {
    toast.error('Incorrect', { theme });
  };

  const {
    isConnected,
    canStartGame,
    onStartGame,
    machineState,
    score,
    teams,
    lives,
    onGuess,
    onSkip,
  } = useClientSocket({ correctAction, incorrectAction });
  const { playerCount, list } = usePlayerSearch();

  return (
    <div className="flex flex-col h-full m-16 space-y-8">
      <div className="justify-start">
        <p>Status: {isConnected ? 'connected' : 'disconnected'}</p>
        <p>State: {machineState}</p>
        {isConnected && (
          <div>{canStartGame && <Button onPress={onStartGame}>Start Game</Button>}</div>
        )}
      </div>

      {teams && (
        <div className="flex flex-col items-center space-y-8">
          <div className="flex flex-col items-center">
            <p className="font-black text-2xl">Lives: {lives}</p>
            <p className="font-black text-2xl">Score: {score}</p>
          </div>
          <CareerPath teams={teams} />
          <PlayerSearchBar
            className="w-1/2"
            playerCount={playerCount}
            list={list}
            onSelect={onGuess}
          />
          <Button onPress={onSkip}>Skip</Button>
        </div>
      )}
    </div>
  );
}
