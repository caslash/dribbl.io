'use server';

import prisma from '@/database/prismaClient';

export async function getPlayers() {
  return await prisma.player.findMany();
}

export async function getPlayerCount() {
  return await prisma.player.count();
}
