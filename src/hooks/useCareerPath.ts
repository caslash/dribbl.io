'use client';

import { getRandomPlayer } from '@/app/actions';
import { Player, Prisma } from '@prisma/client';
import { useState } from 'react';

const useCareerPath = () => {
  const [streak, setStreak] = useState<number>(0);
  const [player, setPlayer] = useState<Player | null>();

  const [playerPoolFilter, setPlayerPoolFilter] = useState<Prisma.PlayerWhereInput>();

  const onStart = () => {
    getRandomPlayer(playerPoolFilter).then(setPlayer);
  };

  const checkGuess = (
    key: React.Key | null,
    onCorrect: (correctPlayer: Player) => void,
    onIncorrect: (correctPlayer: Player) => void,
  ) => {
    if (key) {
      const previousPlayer = player!;
      if (key == player?.id) {
        onCorrect(previousPlayer);
        setStreak(streak + 1);
      } else {
        onIncorrect(previousPlayer);
        setStreak(0);
      }
      onStart();
    }
  };

  return { player, setPlayerPoolFilter, onStart, checkGuess, streak };
};

export default useCareerPath;
