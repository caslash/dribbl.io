'use server';

import prisma from '@/database/prismaClient';
import { Player, Prisma } from '@prisma/client';
import * as runtime from '@prisma/client/runtime/library.js';

import $Extensions = runtime.Types.Extensions;

export async function getPlayers<
  T extends Prisma.PlayerFindManyArgs,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
>(args?: Prisma.SelectSubset<T, Prisma.PlayerFindManyArgs<ExtArgs>>) {
  return await prisma.player.findMany(args);
}

export async function getPlayer<
  T extends Prisma.PlayerFindFirstArgs,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
>(args?: Prisma.SelectSubset<T, Prisma.PlayerFindFirstArgs<ExtArgs>>) {
  return await prisma.player.findFirst(args);
}

export async function getRandomPlayer(
  where?: Prisma.PlayerWhereInput,
): Promise<Player | undefined> {
  const playerIds = (await getPlayers({ where: where, select: { id: true } })).map(
    (player) => player.id,
  );
  const randomId = playerIds[Math.floor(Math.random() * playerIds.length)];
  const randomPlayer = await getPlayer({ where: { id: { equals: randomId } } });

  return randomPlayer ? randomPlayer : undefined;
}

export async function getPlayerCount() {
  return await prisma.player.count();
}
