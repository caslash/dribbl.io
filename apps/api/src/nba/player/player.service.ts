import { NBAPrismaService } from '@/database/nba.prisma.service';
import { runtime } from '@dribblio/database';
import { Prisma as NBAPrisma, Player } from '@dribblio/database/generated/prisma-nba';
import { Injectable } from '@nestjs/common';

import $Extensions = runtime.Types.Extensions;

@Injectable()
export class PlayersService {
  constructor(private nba: NBAPrismaService) {}

  async findAll<
    T extends NBAPrisma.PlayerFindManyArgs,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  >(args?: NBAPrisma.SelectSubset<T, NBAPrisma.PlayerFindManyArgs<ExtArgs>>) {
    return await this.nba.player.findMany(args);
  }

  async findOne(id: number): Promise<Player | null> {
    return await this.nba.player.findFirst({ where: { id: { equals: id } } });
  }

  async findRandom(where?: NBAPrisma.PlayerWhereInput): Promise<Player | null> {
    const playerIds = (await this.findAll({ where: where, select: { id: true } })).map(
      (player) => player.id,
    );
    const randomId = playerIds[Math.floor(Math.random() * playerIds.length)];
    return await this.findOne(randomId);
  }

  async findCount(): Promise<number> {
    return await this.nba.player.count();
  }
}
