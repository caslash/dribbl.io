'use client';

import GameModeCard from '@/components/gamemodecard';
import { useEffect } from 'react';
import { getAccessToken } from '@auth0/nextjs-auth0';

export default function Home() {
  useEffect(() => {
    getAccessToken().then((jwt) => {
      fetch('/api/players', {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }).then((res) => console.log(res));
    });
  });

  return (
    <div className="h-dvh w-full p-16">
      <div className="h-full flex flex-row justify-center space-x-8">
        <GameModeCard
          className="w-1/2"
          title="Single Player"
          description="Test your own knowledge, but you only have 5 lives."
          href="/singleplayer"
          imageHref="/images/jaylenbrown.jpg"
        />
        <GameModeCard
          className="w-1/2"
          title="Multiplayer"
          description="Compete against friends and come out on top."
          href="/multiplayer"
          imageHref="/images/jaysontatum.webp"
        />
      </div>
    </div>
  );
}
