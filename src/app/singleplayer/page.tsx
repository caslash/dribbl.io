'use client';

import { CorrectAnswerView, IncorrectAnswerView } from '@/components/answerview';
import { CareerPathView } from '@/components/careerpathview';
import PlayerSearchBar from '@/components/playersearchbar';
import useCareerPath from '@/hooks/useCareerPath';
import useConfetti from '@/hooks/useConfetti';
import usePlayerSearch from '@/hooks/usePlayerSearch';
import { Button } from '@heroui/react';
import { Player } from '@prisma/client';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

export default function SinglePlayer() {
  const { theme } = useTheme();
  const { currentPlayer, onStart, checkGuess, streak, setPlayerPoolFilter } = useCareerPath();
  const { onConfetti } = useConfetti();
  const { playerCount, list } = usePlayerSearch();

  useEffect(
    () =>
      setPlayerPoolFilter({
        team_history: { contains: ',' },
        total_games_played: { gte: 800 },
      }),
    [setPlayerPoolFilter],
  );

  const correctAction = (correctPlayer: Player) => {
    toast(<CorrectAnswerView correctPlayer={correctPlayer} />, { theme });
    onConfetti();
  };

  const incorrectAction = (possibleAnswers: Player[]) => {
    toast(<IncorrectAnswerView possibleAnswers={possibleAnswers} />, { theme });
  };

  return (
    <div className="flex flex-col h-full items-center m-16 space-y-8">
      {!currentPlayer && <Button onPress={onStart}>Start Game</Button>}
      {currentPlayer && (
        <div className="flex flex-col items-center">
          <p className={`font-black text-xl`}>Streak:</p>
          <p className={`font-semibold text-6xl`}>{streak}</p>
        </div>
      )}
      <CareerPathView player={currentPlayer} theme={theme} />
      <PlayerSearchBar
        playerCount={playerCount}
        list={list}
        className="w-1/2"
        onSelectionChange={(key) => checkGuess(key, correctAction, incorrectAction)}
      />
    </div>
  );
}
