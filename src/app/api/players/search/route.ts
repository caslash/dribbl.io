import prisma from '@/database/prismaClient';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const params = request?.nextUrl?.searchParams;
  const searchTerm: string = params.get('searchTerm') ?? '';

  const results = await prisma.player.findMany({
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
