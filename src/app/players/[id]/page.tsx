import prisma from '@/database/prismaClient';

export default async function PlayerPage({
  params,
}: Readonly<{ params: Promise<{ id: number }> }>) {
  const id = Number((await params).id);
  const player = await prisma.player.findFirst({ where: { id: { equals: id } } });
  return (
    <div>
      <h1>{player?.display_first_last}</h1>
    </div>
  );
}
