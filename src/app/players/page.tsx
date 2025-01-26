import prisma from '@/database/prismaClient';
import PlayerTable from '@/components/playertable';

export default async function Players() {
  const players = await prisma.player.findMany();

  return (
    <div>
      <PlayerTable players={players} />
    </div>
  );
}
