import { Player } from '@dribblio/types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
}
