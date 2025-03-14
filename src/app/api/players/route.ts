import { getPlayerCount, getPlayers } from '@/server/actions';
import { Player } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export type PaginatedResponse = {
  players: Player[];
  total: number;
};

export async function GET(request: NextRequest): Promise<NextResponse<PaginatedResponse>> {
  const params = request?.nextUrl?.searchParams;
  const page: number = +(params.get('page') ?? 0);
  const rowsPerPage: number = +(params.get('rowsPerPage') ?? 0);

  const startingPos: number = (page - 1) * rowsPerPage;

  const players: Player[] = await getPlayers({
    orderBy: {
      last_name: 'asc',
    },
    skip: startingPos,
    take: rowsPerPage,
  });

  const total: number = await getPlayerCount();

  return NextResponse.json({
    players,
    total,
  });
}
