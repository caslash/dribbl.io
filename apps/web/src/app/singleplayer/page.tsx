'use client';

import { CorrectAnswer } from '@/components/careerpath/answer';
import { CareerPath } from '@/components/careerpath/careerpathview';
import SinglePlayerConfigModal from '@/components/config/singleplayer/configmodal';
import PlayerSearchBar from '@/components/search/playersearchbar';
import { Button } from '@/components/ui/button';
import useConfetti from '@/hooks/useConfetti';
import useSinglePlayerSocket from '@/hooks/useSinglePlayerSocket';
import { nba } from '@dribblio/database';
import { useTheme } from 'next-themes';
import { toast } from 'react-toastify';

export default function SinglePlayer() {
  const { theme } = useTheme();
  const { onConfetti } = useConfetti();

  const correctAction = (validAnswers: nba.Player[]) => {
    toast(<CorrectAnswer validAnswers={validAnswers} />, { theme });
    onConfetti();
  };

  const incorrectAction = () => {
    toast.error('Incorrect', { theme });
  };

  const {
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
  } = useSinglePlayerSocket({ correctAction, incorrectAction });

  return (
    <div className="flex flex-col h-full space-y-8">
      <SinglePlayerConfigModal isOpen={!isRoomConfigured} onConfigureRoom={onConfigureRoom} />
      <div className="justify-start">
        <p>Status: {isConnected ? 'connected' : 'disconnected'}</p>
        <p>State: {machineState}</p>
      </div>

      {isConnected && (
        <div className="w-full flex flex-col items-center space-y-8">
          {canStartGame && <Button onClick={onStartGame}>Start Game</Button>}
          {teams && (
            <div className="w-full flex flex-col items-center space-y-8">
              <div className="flex flex-col items-center">
                <p className="font-black text-2xl">Lives: {lives ?? 'Unlimited'}</p>
                <p className="font-black text-2xl">Score: {score}</p>
              </div>
              <CareerPath teams={teams} />
              <PlayerSearchBar className="w-1/2" onSelect={onGuess} />
              <Button onClick={onSkip}>Skip</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
