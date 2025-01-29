'use client';

import PlayerSearchBar from '@/components/playersearchbar';
import { getRandomPlayer } from '../actions';
import { Player } from '@prisma/client';
import React, { useState } from 'react';
import { Button } from '@heroui/react';
import { v4 } from 'uuid';
import TeamLogo from '@/components/teamlogo';

export default function SinglePlayer() {
  const [player, setPlayer] = useState<Player | null>();

  const checkGuessedPlayer = (key: React.Key | null) => {
    if (key) {
      console.log(`USER GUESSED: ${key}`);
    }
  };

  const fetchRandomPlayer = () => {
    getRandomPlayer({ rosterstatus: { equals: 'Active' }, total_games_played: { gte: 700 } }).then(
      setPlayer,
    );
  };

  return (
    <div className="flex flex-col items-center m-16 space-y-8">
      <Button onPressEnd={() => fetchRandomPlayer()}>Get Random Player</Button>
      <h1>{player?.display_first_last}</h1>
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
