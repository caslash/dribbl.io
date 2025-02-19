import { getPlayers } from '@/server/actions';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const players = await getPlayers({
    include: {
      player_accolades: {
        select: {
          accolades: true,
        },
      },
    },
  });

  const awards: string[] = [
    ...new Set(
      players
        .flatMap((player) =>
          player.player_accolades?.accolades?.PlayerAwards.map((award) => award.DESCRIPTION),
        )
        .filter((playerAwards) => playerAwards !== undefined)
        .sort(),
    ),
  ];

  return Response.json({
    count: awards.length,
    awards,
  });
}
