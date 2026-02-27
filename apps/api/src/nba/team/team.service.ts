import { Team } from '@dribblio/types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  findAll(): Promise<Team[]> {
    return this.teamRepository.find();
  }

  findOne(teamId: number): Promise<Team | null> {
    return this.teamRepository.findOne({
      where: { teamId },
      relations: {
        players: true,
      },
    });
  }
}
