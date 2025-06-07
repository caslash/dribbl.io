import { Player, Prisma, runtime } from '@dribblio/database';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

import $Extensions = runtime.Types.Extensions;

@Injectable()
export class PlayersService {
  constructor(private prisma: PrismaService) {}

  async findAll<
    T extends Prisma.PlayerFindManyArgs,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  >(args?: Prisma.SelectSubset<T, Prisma.PlayerFindManyArgs<ExtArgs>>) {
    return await this.prisma.player.findMany(args);
  }

  async findOne(id: number): Promise<Player | null> {
    return await this.prisma.player.findFirst({ where: { id: { equals: id } } });
  }

  async findRandom(where?: Prisma.PlayerWhereInput): Promise<Player | null> {
    const playerIds = (await this.findAll({ where: where, select: { id: true } })).map(
      (player) => player.id,
    );
    const randomId = playerIds[Math.floor(Math.random() * playerIds.length)];
    return await this.findOne(randomId);
  }

  async findCount(): Promise<number> {
    return await this.prisma.player.count();
  }
}
