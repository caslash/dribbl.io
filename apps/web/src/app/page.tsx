'use client';

import GameModeCard from '@/components/gamemodecard';
import { useDBUser } from '@/context/dbusercontext';

export default function Home() {
  const { hasPermission } = useDBUser();

  return (
    <div className="h-full flex flex-row justify-center space-x-8">
      <GameModeCard
        className="w-1/2"
        title="Single Player"
        description="Test your own knowledge: maintain your streak, or risk your five alloted lives."
        href="/singleplayer"
        imageHref="/images/jaylenbrown.jpg"
      />
      <GameModeCard
        className="w-1/2"
        title="Multiplayer"
        description="Compete against friends and come out on top."
        href="/multiplayer"
        imageHref="/images/jaysontatum.webp"
        disabled={!hasPermission('play:multiplayer')}
      />
    </div>
  );
}
