'use client';

import { CareerPathView } from '@/components/careerpathview';
import CorrectAnswerView from '@/components/correctanswerview';
import PlayerSearchBar from '@/components/playersearchbar';
import useCareerPath from '@/hooks/useCareerPath';
import useConfetti from '@/hooks/useConfetti';
import { Button } from '@heroui/react';
import { Player } from '@prisma/client';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

export default function SinglePlayer() {
  const { theme } = useTheme();
  const { player, onStart, checkGuess, streak, setPlayerPoolFilter } = useCareerPath();
  const { onConfetti } = useConfetti();

  useEffect(
    () => setPlayerPoolFilter({ isActive: { equals: true }, total_games_played: { gte: 800 } }),
    [setPlayerPoolFilter],
  );

  const correctAction = (correctPlayer: Player) => {
    toast(<CorrectAnswerView isCorrect correctPlayer={correctPlayer} />, { theme });
    onConfetti();
  };

  const incorrectAction = (correctPlayer: Player) => {
    toast(<CorrectAnswerView isCorrect={false} correctPlayer={correctPlayer} />, { theme });
  };

  return (
    <div className="flex flex-col h-full items-center m-16 space-y-8">
      <Button onPress={onStart}>Start Game</Button>
      {player && (
        <div className="flex flex-col items-center">
          <p className={`font-black text-xl`}>Streak:</p>
          <p className={`font-semibold text-6xl`}>{streak}</p>
        </div>
      )}
      <CareerPathView player={player} />
      <PlayerSearchBar
        className="w-1/2"
        onSelectionChange={(key) => checkGuess(key, correctAction, incorrectAction)}
      />
    </div>
  );
}
