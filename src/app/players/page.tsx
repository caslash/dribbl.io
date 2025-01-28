import React from 'react';
import PlayerSearchBar from '@/components/playersearchbar';

export default function Players() {
  return (
    <div className="flex flex-col items-center m-16 space-y-8">
      <PlayerSearchBar className="w-1/2" />
    </div>
  );
}
