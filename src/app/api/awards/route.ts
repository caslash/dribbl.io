import { getPlayers } from '@/server/actions';
import { NextResponse } from 'next/server';

export type AwardsResponse = {
  count: number;
  awards: string[];
};

export async function GET(): Promise<NextResponse<AwardsResponse>> {
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

  return NextResponse.json({
    count: awards.length,
    awards,
  });
}
