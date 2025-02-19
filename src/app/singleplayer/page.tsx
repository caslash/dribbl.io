'use client';

import { CorrectAnswer, IncorrectAnswer } from '@/components/careerpath/answer';
import { CareerPath } from '@/components/careerpath/careerpathview';
import PlayerSearchBar from '@/components/search/playersearchbar';
import useCareerPath from '@/hooks/useCareerPath';
import useConfetti from '@/hooks/useConfetti';
import usePlayerSearch from '@/hooks/usePlayerSearch';
import { GameModes } from '@/server/lib/gamemodes';
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

  useEffect(() => setPlayerPoolFilter(GameModes.easy.filter), [setPlayerPoolFilter]);

  const correctAction = (correctPlayer: Player) => {
    toast(<CorrectAnswer correctPlayer={correctPlayer} />, { theme });
    onConfetti();
  };

  const incorrectAction = (possibleAnswers: Player[]) => {
    toast(<IncorrectAnswer possibleAnswers={possibleAnswers} />, { theme });
  };

  return (
    <div className="flex flex-col h-full items-center m-16 space-y-8">
      {!currentPlayer && <Button onPress={onStart}>Start Game</Button>}
      {currentPlayer && (
        <div className="flex flex-col w-full items-center space-y-8">
          <div className="flex flex-col items-center">
            <p className={`font-black text-xl`}>Streak:</p>
            <p className={`font-semibold text-6xl`}>{streak}</p>
          </div>

          <CareerPath teams={currentPlayer?.team_history?.split(',')} />

          <PlayerSearchBar
            playerCount={playerCount}
            list={list}
            className="w-1/2"
            onSelect={(id: number) => checkGuess(id, correctAction, incorrectAction)}
          />
        </div>
      )}
    </div>
  );
}
