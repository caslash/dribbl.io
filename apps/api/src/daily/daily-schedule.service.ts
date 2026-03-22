import { DailyChallenge } from '@dribblio/types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/**
 * Thin data-access layer for `daily_challenges`.
 *
 * Kept intentionally narrow so game-type-specific services (e.g. RosterService)
 * own their own loading and caching logic.
 */
@Injectable()
export class DailyScheduleService {
  constructor(
    @InjectRepository(DailyChallenge)
    private readonly repo: Repository<DailyChallenge>,
  ) {}

  /**
   * Returns the challenge for the given game type and ISO date, or `null` if
   * none has been scheduled.
   *
   * @param gameType - Discriminator identifying the game mode, e.g. `'roster'`.
   * @param date - Calendar date as `"YYYY-MM-DD"`.
   *
   * @example
   * const challenge = await service.lookupByDate('roster', '2026-03-22');
   */
  async lookupByDate(
    gameType: string,
    date: string,
  ): Promise<DailyChallenge | null> {
    return this.repo.findOne({ where: { gameType, challengeDate: date } });
  }
}
