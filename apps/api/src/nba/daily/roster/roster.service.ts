import {
  DailyChallenge,
  Player,
  RosterGuessDto,
  RosterGuessResponseDto,
  RosterRevealDto,
  Team,
} from '@dribblio/types';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DailyScheduleService } from '@/nba/daily/daily-schedule.service';

/** In-memory cache for the most recently loaded daily challenge. */
interface RosterCache {
  /** The ISO date string this cache entry is valid for. */
  date: string;
  challenge: DailyChallenge;
  team: Team;
  /** All players qualifying for this team/season — used for guess validation. */
  roster: Player[];
}

/**
 * Service for the Daily Roster Challenge game mode.
 *
 * Maintains a single in-process cache for the most recently requested date's
 * challenge. Past-date challenges are static, so the cache entry is valid
 * indefinitely for that date. The cache is replaced whenever a different date
 * is requested.
 *
 * @example
 * const result = await service.getChallenge('2026-03-22');
 * if (!result) throw new NotFoundException();
 */
@Injectable()
export class RosterService {
  private cache: RosterCache | null = null;

  constructor(
    private readonly dailyScheduleService: DailyScheduleService,
    @InjectRepository(Player)
    private readonly playerRepo: Repository<Player>,
    @InjectRepository(Team)
    private readonly teamRepo: Repository<Team>,
  ) {}

  private getLocalDate(): string {
    return new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD in local time
  }

  /**
   * Ensures the cache is populated for the given date. Returns the cached
   * entry, or `null` if no challenge or team record exists for that date.
   */
  private async ensureCached(date: string): Promise<RosterCache | null> {
    if (this.cache?.date === date) return this.cache;

    const challenge = await this.dailyScheduleService.lookupByDate('roster', date);
    if (!challenge) return null;

    const team = await this.teamRepo.findOne({
      where: { teamId: challenge.teamId },
    });
    if (!team) return null;

    const roster = await this.loadRoster(challenge.teamId, challenge.seasonId);
    this.cache = { date, challenge, team, roster };
    return this.cache;
  }

  /**
   * Returns the challenge metadata for the given ISO date, or `null` when no
   * challenge has been scheduled.
   *
   * @param date - Calendar date as `"YYYY-MM-DD"`.
   *
   * @example
   * const result = await service.getChallenge('2026-03-22');
   */
  async getChallenge(date: string): Promise<{
    challenge: DailyChallenge;
    team: Team;
    rosterSize: number;
  } | null> {
    const cached = await this.ensureCached(date);
    if (!cached) return null;
    return { challenge: cached.challenge, team: cached.team, rosterSize: cached.roster.length };
  }

  /**
   * Convenience wrapper that returns today's challenge metadata.
   * Delegates to `getChallenge` with the current local date.
   *
   * @example
   * const result = await service.getTodayChallenge();
   * if (!result) throw new NotFoundException();
   */
  async getTodayChallenge(): Promise<{
    challenge: DailyChallenge;
    team: Team;
    rosterSize: number;
  } | null> {
    return this.getChallenge(this.getLocalDate());
  }

  /**
   * Returns the earliest scheduled roster challenge date, or `null` if none exist.
   *
   * @example
   * const earliest = await service.getEarliestDate(); // e.g. "2026-03-22"
   */
  async getEarliestDate(): Promise<string | null> {
    return this.dailyScheduleService.getEarliestDate('roster');
  }

  /**
   * Returns the full roster for the given date's challenge, or `null` when no
   * challenge is scheduled for that date.
   *
   * @param date - Calendar date as `"YYYY-MM-DD"`.
   *
   * @example
   * const reveal = await service.getReveal('2026-03-22');
   * if (!reveal) throw new NotFoundException({ error: 'NO_CHALLENGE' });
   */
  async getReveal(date: string): Promise<RosterRevealDto | null> {
    const cached = await this.ensureCached(date);
    if (!cached) return null;

    return {
      players: cached.roster.map((p) => ({
        playerId: p.playerId,
        fullName: p.fullName,
        position: p.position,
        jerseyNumber: p.jerseyNumber,
      })),
    };
  }

  /**
   * Validates a single guess against the roster for the given date.
   *
   * The caller is responsible for supplying `namedIds` — the server never
   * stores per-user session state. A `duplicate` result means the player was
   * already named; no life should be deducted in that case.
   *
   * @param dto - The guess payload including all previously named IDs.
   * @param date - Calendar date as `"YYYY-MM-DD"`.
   *
   * @example
   * const result = await service.guess({ guessId: 2544, namedIds: [] }, '2026-03-22');
   */
  async guess(dto: RosterGuessDto, date: string): Promise<RosterGuessResponseDto> {
    const cached = await this.ensureCached(date);
    if (!cached) throw new NotFoundException({ error: 'NO_CHALLENGE' });

    const { roster } = cached;
    const rosterSize = roster.length;

    const player = await this.playerRepo.findOne({
      where: { playerId: dto.guessId },
      select: ['playerId', 'fullName', 'position', 'jerseyNumber'],
    });

    if (!player) {
      return { correct: false, rosterSize };
    }

    const playerShape = {
      playerId: player.playerId,
      fullName: player.fullName,
      position: player.position,
      jerseyNumber: player.jerseyNumber,
    };

    if (dto.namedIds.includes(dto.guessId)) {
      return { correct: true, duplicate: true, player: playerShape, rosterSize };
    }

    const isOnRoster = roster.some(
      (p) => Number(p.playerId) === dto.guessId,
    );

    if (isOnRoster) {
      return {
        correct: true,
        player: playerShape,
        namedIds: [...dto.namedIds, dto.guessId],
        rosterSize,
      };
    }

    return { correct: false, rosterSize };
  }

  /**
   * Fetches all distinct players who appeared for the given team in the given
   * season (Regular Season games only, at least 1 game played).
   *
   * TOT (multi-team aggregate) rows are excluded naturally because they have
   * `team_id = NULL`, and we filter by a specific `team_id`.
   *
   * @param teamId - The team to load the roster for.
   * @param seasonId - The season identifier, e.g. `"2023-24"`.
   */
  private async loadRoster(
    teamId: number,
    seasonId: string,
  ): Promise<Player[]> {
    return this.playerRepo
      .createQueryBuilder('player')
      .innerJoin(
        'player.seasons',
        'season',
        'season.seasonType = :seasonType AND season.teamId = :teamId AND season.seasonId = :seasonId AND season.gp >= 1',
        { seasonType: 'Regular Season', teamId, seasonId },
      )
      .select([
        'player.playerId',
        'player.fullName',
        'player.position',
        'player.jerseyNumber',
      ])
      .distinct(true)
      .getMany();
  }
}
