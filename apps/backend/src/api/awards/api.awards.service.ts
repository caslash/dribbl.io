import { PrismaService } from '@/database/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AwardsService {
  constructor(private prisma: PrismaService) {}

  async awards(): Promise<string[]> {
    const allPlayerAwards = await this.prisma.player.findMany({
      include: {
        player_accolades: {
          select: {
            accolades: true,
          },
        },
      },
    });

    const awards = [
      ...new Set(
        allPlayerAwards
          .flatMap((player) =>
            player.player_accolades?.accolades?.PlayerAwards.map(
              (award) => award.DESCRIPTION,
            ),
          )
          .sort(),
      ),
    ];

    return awards.filter(Boolean) as string[];
  }
}
