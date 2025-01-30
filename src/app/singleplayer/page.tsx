'use client';

import PlayerSearchBar from '@/components/playersearchbar';
import { getRandomPlayer } from '../actions';
import { Player } from '@prisma/client';
import React, { useState } from 'react';
import { Button } from '@heroui/react';
import { v4 } from 'uuid';
import TeamLogo from '@/components/teamlogo';
import CorrectAnswerView from '@/components/correctanswerview';
import { toast } from 'react-toastify';
import { useTheme } from 'next-themes';
import confetti from 'canvas-confetti';

export default function SinglePlayer() {
  const { theme } = useTheme();
  const [player, setPlayer] = useState<Player | null>();
  const [streak, setStreak] = useState<number>(0);

  const onConfetti = () => {
    const end = Date.now() + 1 * 1000;
    const colors = ['#1d428a', '#c8102e', '#ffffff'];

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  };

  const checkGuessedPlayer = (key: React.Key | null) => {
    if (key) {
      const previousPlayer = player!;
      if (key == player?.id) {
        toast(<CorrectAnswerView isCorrect correctPlayer={previousPlayer} />, { theme });
        onConfetti();
        setStreak(streak + 1);
      } else {
        toast(<CorrectAnswerView isCorrect={false} correctPlayer={previousPlayer} />, {
          theme,
        });
        setStreak(0);
      }
      fetchRandomPlayer();
    }
  };

  const fetchRandomPlayer = () => {
    getRandomPlayer({ total_games_played: { gte: 800 } }).then(setPlayer);
  };

  return (
    <div className="flex flex-col h-full items-center m-16 space-y-8">
      <Button onPressEnd={() => fetchRandomPlayer()}>Start Game</Button>
      {player && (
        <div className="flex flex-col items-center">
          <p className={`font-black text-xl`}>Streak:</p>
          <p className={`font-semibold text-6xl`}>{streak}</p>
        </div>
      )}
      {player?.team_history && (
        <div className="flex flex-row">
          {player.team_history.split(',').map((id: string) => (
            <TeamLogo key={v4()} teamId={id} />
          ))}
        </div>
      )}
      <PlayerSearchBar className="w-1/2" onSelectionChange={(key) => checkGuessedPlayer(key)} />
    </div>
  );
}
