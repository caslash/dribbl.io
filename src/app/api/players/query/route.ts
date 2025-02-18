import { getPlayers } from '@/server/actions';

export async function POST(request: Request) {
  const body = await request.json();

  const players = await getPlayers(body);

  return Response.json({
    players,
  });
}
