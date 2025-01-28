'use client';

import PlayerSearchBar from '@/components/playersearchbar';
import { getRandomPlayer } from '../actions';
import { Player } from '@prisma/client';
import React, { useState } from 'react';
import { Button, Image } from '@heroui/react';
import NextImage from 'next/image';
import { v4 } from 'uuid';

export default function SinglePlayer() {
  const [player, setPlayer] = useState<Player | null>();

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
            <Image
              key={v4()}
              alt={`logo-${id}`}
              as={NextImage}
              src={`/logos/${id}.svg`}
              width={100}
              height={100}
            />
          ))}
        </div>
      )}
      <PlayerSearchBar className="w-1/2" />
    </div>
  );
}
