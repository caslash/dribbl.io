import { PoolGenerator } from '@/nba/pool/generator.interface';
import { FranchisePoolEntry, Season, Team } from '@dribblio/types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FranchisePoolGenerator implements PoolGenerator {
  constructor(
    @InjectRepository(Season)
    private readonly seasonRepository: Repository<Season>,
  ) {}

  /**
   * Generates one pool entry per unique player–franchise combination.
   * TOT rows (multi-team season aggregates) are excluded. Deduplication is
   * performed in memory after fetching since each (playerId, teamId) pair may
   * appear across multiple seasons.
   *
   * @returns One `FranchisePoolEntry` per unique player–franchise pairing,
   *          sorted by player ID then franchise abbreviation.
   *
   * @example
   * const entries = await generator.generate();
   * // [{ entryId: '2544-1610612747', playerName: 'LeBron James', franchiseName: 'Los Angeles Lakers', ... }]
   */
  async generate(): Promise<FranchisePoolEntry[]> {
    const seasons = await this.seasonRepository
      .createQueryBuilder('season')
      .innerJoinAndSelect('season.player', 'player')
      .innerJoinAndSelect('season.team', 'team')
      .where('season.seasonType = :type', { type: 'Regular Season' })
      .andWhere('season.teamAbbreviation != :tot', { tot: 'TOT' })
      .orderBy('season.playerId', 'ASC')
      .addOrderBy('team.abbreviation', 'ASC')
      .getMany();

    const seen = new Set<string>();
    const entries: FranchisePoolEntry[] = [];

    for (const season of seasons) {
      const key = `${season.playerId}-${season.teamId}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const team = season.team as Team;
      entries.push({
        entryId: key,
        draftMode: 'franchise' as const,
        playerId: season.player.playerId,
        playerName: season.player.fullName,
        franchiseName: team.fullName,
        franchiseAbbr: team.abbreviation,
        available: true,
      });
    }

    return entries;
  }
}
