import { Button } from '@/components/ui/button';
import NextLink from 'next/link';

export default function Home() {
  return (
    <div className="h-screen w-screen grid grid-cols-3 grid-rows-3">
      <div className="col-start-2 row-start-2 place-self-center flex flex-row space-x-8">
        <Button asChild color="primary">
          <NextLink href="/singleplayer">Single Player</NextLink>
        </Button>
        <Button color="secondary">
          <NextLink href="/multiplayer">Multiplayer</NextLink>
        </Button>
      </div>
    </div>
  );
}
