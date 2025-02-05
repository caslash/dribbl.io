import { Button } from '@heroui/react';
import NextLink from 'next/link';

export default function Home() {
  return (
    <div className="h-screen w-screen grid grid-cols-3 grid-rows-3">
      <div className="col-start-2 row-start-2 place-self-center flex flex-row space-x-8">
        <Button as={NextLink} href="/singleplayer" variant="shadow" color="primary" radius="sm">
          Single Player
        </Button>
        <Button as={NextLink} href="/multiplayer" variant="shadow" color="secondary" radius="sm">
          Multiplayer
        </Button>
      </div>
    </div>
  );
}
