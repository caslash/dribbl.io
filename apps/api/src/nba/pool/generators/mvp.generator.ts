import { PoolGenerator } from '@/nba/pool/generator.interface';
import { Accolade, MvpPoolEntry, Season } from '@dribblio/types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MvpPoolGenerator implements PoolGenerator {
  constructor(
    @InjectRepository(Season)
    private readonly seasonRepository: Repository<Season>,
  ) {}

  async generate(): Promise<MvpPoolEntry[]> {
    const seasons = await this.seasonRepository
      .createQueryBuilder('season')
      .innerJoin(
        Accolade,
        'accolade',
        [
          'accolade.playerId = season.playerId',
          'accolade.season = season.seasonId',
          'accolade.description ILIKE :mvp',
        ].join(' AND '),
        {
          mvp: '%NBA Most Valuable Player%',
        },
      )
      .innerJoinAndSelect('season.player', 'player')
      .where('season.seasonType = :type', { type: 'Regular Season' })
      .orderBy('season.seasonId', 'ASC')
      .getMany();

    return seasons.map((season) => ({
      entryId: `${season.player.playerId}-${season.seasonId}`,
      draftMode: 'mvp' as const,
      playerId: season.player.playerId,
      playerName: season.player.fullName,
      season: season.seasonId,
      available: true,
    }));
  }
}
