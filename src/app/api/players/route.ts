import prisma from '@/database/prismaClient';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const params = request?.nextUrl?.searchParams;
  const page: number = +(params.get('page') ?? 0);
  const rowsPerPage: number = +(params.get('rowsPerPage') ?? 0);

  const startingPos = (page - 1) * rowsPerPage;

  const players = await prisma.player.findMany({
    orderBy: {
      last_name: 'asc',
    },
    skip: startingPos,
    take: rowsPerPage,
  });

  const total = await prisma.player.count();

  return Response.json({
    players,
    total,
  });
}
