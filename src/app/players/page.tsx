import React from 'react';
import PlayerSearch from '@/components/playersearch';

export default function Players() {
  return (
    <div className="flex flex-col items-center m-16 space-y-8">
      <PlayerSearch className="w-1/2" />
    </div>
  );
}
