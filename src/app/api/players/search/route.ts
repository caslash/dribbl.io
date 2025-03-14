import { getPlayers } from '@/server/actions';
import { Player } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export type SearchResponse = {
  results: Player[];
};

export async function GET(request: NextRequest): Promise<NextResponse<SearchResponse>> {
  const params = request?.nextUrl?.searchParams;
  const searchTerm: string = params.get('searchTerm') ?? '';

  const results = await getPlayers({
    orderBy: {
      last_name: 'asc',
    },
    where: {
      display_first_last: {
        contains: searchTerm,
        mode: 'insensitive',
      },
    },
  });

  return NextResponse.json({ results });
}
