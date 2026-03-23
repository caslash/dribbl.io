import {
  DailyChallengeDto,
  RosterGuessDto,
  RosterGuessResponseDto,
  RosterRevealDto,
} from '@dribblio/types';
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { RosterService } from '@/nba/daily/roster/roster.service';

/**
 * REST endpoints for the Daily Roster Challenge game mode.
 *
 * All routes are stateless — the client owns its own session state
 * (i.e. `namedIds`) and submits it with every guess.
 *
 * `today` routes are convenience aliases that resolve to the current local
 * date. Date-parameterized routes (`/:date`) accept any `YYYY-MM-DD` string.
 */
@Controller('daily/roster')
export class RosterController {
  constructor(private readonly rosterService: RosterService) {}

  // ---------------------------------------------------------------------------
  // Today convenience aliases — must be declared before :date routes so that
  // NestJS registers the literal paths first.
  // ---------------------------------------------------------------------------

  /**
   * Returns today's challenge metadata.
   *
   * Player names are intentionally omitted from the response; only `rosterSize`
   * is included so the client can render progress without revealing answers.
   */
  @Get('today')
  async getToday(): Promise<DailyChallengeDto> {
    return this.getByDate(new Date().toLocaleDateString('en-CA'));
  }

  /**
   * Returns the full player roster for today's challenge.
   *
   * Intentionally public — the server cannot enforce that clients only call
   * this at game-over, so we rely on client-side discipline.
   */
  @Get('today/reveal')
  async getTodayReveal(): Promise<RosterRevealDto> {
    return this.getRevealByDate(new Date().toLocaleDateString('en-CA'));
  }

  /**
   * Validates a player guess against today's roster.
   *
   * @param dto - Guess payload; includes all previously named IDs so the
   *   server can detect duplicates without maintaining session state.
   */
  @Post('guess')
  async guess(@Body() dto: RosterGuessDto): Promise<RosterGuessResponseDto> {
    return this.guessByDate(new Date().toLocaleDateString('en-CA'), dto);
  }

  /**
   * Returns the earliest scheduled challenge date for the roster game type,
   * or `null` if no challenges exist.
   */
  @Get('earliest-date')
  async getEarliestDate(): Promise<{ date: string | null }> {
    const date = await this.rosterService.getEarliestDate();
    return { date };
  }

  // ---------------------------------------------------------------------------
  // Date-parameterized routes
  // ---------------------------------------------------------------------------

  /**
   * Returns challenge metadata for the given date.
   *
   * @param date - Calendar date as `YYYY-MM-DD`.
   */
  @Get(':date')
  async getByDate(@Param('date') date: string): Promise<DailyChallengeDto> {
    const result = await this.rosterService.getChallenge(date);
    if (!result) throw new NotFoundException({ error: 'NO_CHALLENGE' });

    const { challenge, team, rosterSize } = result;
    return {
      challengeDate: challenge.challengeDate,
      teamId: challenge.teamId,
      teamFullName: team.fullName,
      teamAbbreviation: team.abbreviation,
      seasonId: challenge.seasonId,
      rosterSize,
    };
  }

  /**
   * Returns the full player roster for the given date's challenge.
   *
   * @param date - Calendar date as `YYYY-MM-DD`.
   */
  @Get(':date/reveal')
  async getRevealByDate(@Param('date') date: string): Promise<RosterRevealDto> {
    const result = await this.rosterService.getReveal(date);
    if (!result) throw new NotFoundException({ error: 'NO_CHALLENGE' });
    return result;
  }

  /**
   * Validates a player guess against the roster for the given date.
   *
   * @param date - Calendar date as `YYYY-MM-DD`.
   * @param dto - Guess payload; includes all previously named IDs.
   */
  @Post(':date/guess')
  async guessByDate(
    @Param('date') date: string,
    @Body() dto: RosterGuessDto,
  ): Promise<RosterGuessResponseDto> {
    return this.rosterService.guess(dto, date);
  }
}
