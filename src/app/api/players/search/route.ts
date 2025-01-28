import { NextRequest } from 'next/server';
import { getPlayers } from '@/app/actions';

export async function GET(request: NextRequest) {
  const params = request?.nextUrl?.searchParams;
  const searchTerm: string = params.get('searchTerm') ?? '';

  const results = await getPlayers({
    orderBy: {
      last_name: 'asc',
    },
    where: {
      display_first_last: {
        contains: searchTerm,
      },
    },
  });

  return Response.json({
    results,
  });
}
