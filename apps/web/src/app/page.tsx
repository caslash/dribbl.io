'use client';

import GameModeCard from '@/components/gamemodecard';

export default function Home() {
  return (
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
  );
}
