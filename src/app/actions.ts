'use server';

import prisma from '@/database/prismaClient';
import { Prisma } from '@prisma/client';

export async function getPlayers<T extends Prisma.PlayerFindManyArgs>(
  args?: Prisma.SelectSubset<T, Prisma.PlayerFindManyArgs<any>>,
) {
  return await prisma.player.findMany(args);
}

export async function getPlayer<T extends Prisma.PlayerFindFirstArgs>(
  args?: Prisma.SelectSubset<T, Prisma.PlayerFindFirstArgs<any>>,
) {
  return await prisma.player.findFirst(args);
}

export async function getPlayerCount() {
  return await prisma.player.count();
}
