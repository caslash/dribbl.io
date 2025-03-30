import { PrismaService } from '@/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Player, Prisma } from '@prisma/client';

@Injectable()
export class PlayersService {
  constructor(private prisma: PrismaService) {}

  async random(params: {
    where?: Prisma.PlayerWhereInput;
  }): Promise<Player | undefined> {
    const { where } = params;
    const playerIds: number[] = (
      await this.prisma.player.findMany({
        where,
        select: { id: true },
      })
    ).map((player) => player.id);

    const randomId = playerIds[Math.floor(Math.random() * playerIds.length)];

    const randomPlayer = await this.prisma.player.findFirst({
      where: { id: { equals: randomId } },
    });

    return randomPlayer ? randomPlayer : undefined;
  }

  async all(): Promise<Player[]> {
    return this.prisma.player.findMany();
  }

  async players(params: {
    where?: Prisma.PlayerWhereInput;
  }): Promise<Player[]> {
    const { where } = params;
    return this.prisma.player.findMany({
      where,
    });
  }

  async count(params: { where?: Prisma.PlayerWhereInput }): Promise<number> {
    const { where } = params;
    return this.prisma.player.count({ where });
  }
}
