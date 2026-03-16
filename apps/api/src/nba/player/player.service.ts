import { DifficultyFilter, Player } from '@dribblio/types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) {}

  findAll(): Promise<Player[]> {
    return this.playerRepository.find();
  }

  findOne(playerId: number): Promise<Player | null> {
    return this.playerRepository.findOne({
      where: { playerId },
      relations: {
        accolades: true,
        seasons: true,
      },
    });
  }

  findActive(): Promise<Player[]> {
    return this.playerRepository.find({ where: { isActive: true } });
  }

  search(searchTerm: string): Promise<Player[]> {
    return this.playerRepository.find({
      where: [
        { firstName: ILike(`%${searchTerm}%`) },
        { lastName: ILike(`%${searchTerm}%`) },
        { fullName: ILike(`%${searchTerm}%`) },
      ],
    });
  }

  async findRandomPlayer(filter?: DifficultyFilter): Promise<Player | null> {
    let playerIds: number[];

    if (filter) {
      playerIds = (
        await filter(
          this.playerRepository.createQueryBuilder('player'),
        ).getMany()
      ).map((p) => p.playerId);
    } else {
      playerIds = (
        await this.playerRepository.find({
          select: { playerId: true },
        })
      ).map((p) => p.playerId);
    }

    const randomId = playerIds[Math.floor(Math.random() * playerIds.length)];

    return this.playerRepository.findOne({
      where: { playerId: randomId },
    });
  }
}
