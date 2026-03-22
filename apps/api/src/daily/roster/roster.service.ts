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
import { DailyScheduleService } from '@/daily/daily-schedule.service';

/** In-memory cache for the current day's challenge and resolved roster. */
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
 * Maintains a single in-process cache entry for today's challenge so that
 * repeated `GET /today` and guess requests don't re-query the database on
 * every call. The cache is invalidated automatically when the date changes.
 *
 * @example
 * const result = await service.getTodayChallenge();
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

  /**
   * Returns today's challenge metadata together with the resolved team and
   * roster size, or `null` when no challenge has been scheduled for today.
   *
   * Results are cached for the lifetime of the current calendar day.
   */
  async getTodayChallenge(): Promise<{
    challenge: DailyChallenge;
    team: Team;
    rosterSize: number;
  } | null> {
    const today = new Date().toISOString().slice(0, 10);

    if (this.cache?.date !== today) {
      const challenge = await this.dailyScheduleService.lookupByDate(
        'roster',
        today,
      );
      if (!challenge) return null;

      const team = await this.teamRepo.findOne({
        where: { teamId: challenge.teamId },
      });
      if (!team) return null;

      const roster = await this.loadRoster(challenge.teamId, challenge.seasonId);

      this.cache = { date: today, challenge, team, roster };
    }

    const { challenge, team, roster } = this.cache!;
    return { challenge, team, rosterSize: roster.length };
  }

  /**
   * Returns the full roster for today's challenge, drawing from the in-process
   * cache. Intended to be called at game-over so the client can display missed
   * players in the stagger animation.
   *
   * Returns `null` when no challenge is scheduled for today.
   *
   * @example
   * const reveal = await service.getReveal();
   * if (!reveal) throw new NotFoundException({ error: 'NO_CHALLENGE' });
   */
  async getReveal(): Promise<RosterRevealDto | null> {
    const todayResult = await this.getTodayChallenge();
    if (!todayResult) return null;

    return {
      players: this.cache!.roster.map((p) => ({
        playerId: p.playerId,
        fullName: p.fullName,
        position: p.position,
        jerseyNumber: p.jerseyNumber,
      })),
    };
  }

  /**
   * Validates a single guess against today's roster.
   *
   * The caller is responsible for supplying `namedIds` — the server never
   * stores per-user session state. A `duplicate` result means the player was
   * already named; no life should be deducted in that case.
   *
   * @param dto - The guess payload including all previously named IDs.
   *
   * @example
   * const result = await service.guess({ guessId: 2544, namedIds: [] });
   */
  async guess(dto: RosterGuessDto): Promise<RosterGuessResponseDto> {
    const todayResult = await this.getTodayChallenge();
    if (!todayResult) throw new NotFoundException({ error: 'NO_CHALLENGE' });

    const { rosterSize } = todayResult;

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

    const isOnRoster = this.cache!.roster.some(
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
