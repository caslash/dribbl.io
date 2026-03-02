import { PoolGenerator } from '@/nba/draft/pool/generator.interface';
import { Accolade, MvpSeasonEntry, Season } from '@dribblio/types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MvpPoolGenerator implements PoolGenerator {
  constructor(
    @InjectRepository(Season)
    private readonly seasonRepository: Repository<Season>,
  ) {}

  async generate(): Promise<MvpSeasonEntry[]> {
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
      id: `${season.player.playerId}-${season.seasonId}`,
      playerId: `${season.player.playerId}`,
      player: { id: `${season.player.playerId}`, name: season.player.fullName },
      season: season.seasonId,
      available: true,
    }));
  }
}
