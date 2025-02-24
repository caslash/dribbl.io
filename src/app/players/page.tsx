'use client';

import PlayerSearchBar from '@/components/search/playersearchbar';
import { useState } from 'react';

export default function Players() {
  const [playerId, setPlayerId] = useState<number>();
  return (
    <div className="flex flex-col items-center m-16 space-y-8">
      <p>{playerId}</p>
      <PlayerSearchBar className="w-1/2" onSelect={setPlayerId} />
    </div>
  );
}
