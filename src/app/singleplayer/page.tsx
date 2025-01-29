'use client';

import PlayerSearchBar from '@/components/playersearchbar';
import { getRandomPlayer } from '../actions';
import { Player } from '@prisma/client';
import React, { useState } from 'react';
import { Button } from '@heroui/react';
import { v4 } from 'uuid';
import TeamLogo from '@/components/teamlogo';
import toast from 'react-hot-toast';

export default function SinglePlayer() {
  const [player, setPlayer] = useState<Player | null>();
  const [streak, setStreak] = useState<number>(0);

  const checkGuessedPlayer = (key: React.Key | null) => {
    if (key) {
      if (key == player?.id) {
        toast.success(`${player?.display_first_last} is correct!`);
        setStreak(streak + 1);
      } else {
        toast.error(`Wrong! ${player?.display_first_last} was the correct answer.`);
        setStreak(0);
      }
      fetchRandomPlayer();
    }
  };

  const fetchRandomPlayer = () => {
    getRandomPlayer({ rosterstatus: { equals: 'Active' }, total_games_played: { gte: 700 } }).then(
      setPlayer,
    );
  };

  return (
    <div className="flex flex-col items-center m-16 space-y-8">
      {!player && <Button onPressEnd={() => fetchRandomPlayer()}>Start Game</Button>}
      {player && (
        <div>
          <p>Streak:</p>
          <p>{streak}</p>
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
