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
  Post,
} from '@nestjs/common';
import { RosterService } from '@/nba/daily/roster/roster.service';

/**
 * REST endpoints for the Daily Roster Challenge game mode.
 *
 * All routes are stateless — the client owns its own session state
 * (i.e. `namedIds`) and submits it with every guess.
 */
@Controller('daily/roster')
export class RosterController {
  constructor(private readonly rosterService: RosterService) {}

  /**
   * Returns today's challenge metadata.
   *
   * Player names are intentionally omitted from the response; only `rosterSize`
   * is included so the client can render progress without revealing answers.
   */
  @Get('today')
  async getToday(): Promise<DailyChallengeDto> {
    const result = await this.rosterService.getTodayChallenge();
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
   * Returns the full player roster for today's challenge.
   *
   * Intentionally public — the server cannot enforce that clients only call
   * this at game-over, so we rely on client-side discipline. The roster is
   * served from the in-process cache; no additional DB query is made.
   */
  @Get('today/reveal')
  async getReveal(): Promise<RosterRevealDto> {
    const result = await this.rosterService.getReveal();
    if (!result) throw new NotFoundException({ error: 'NO_CHALLENGE' });
    return result;
  }

  /**
   * Validates a player guess against today's roster.
   *
   * @param dto - Guess payload; includes all previously named IDs so the
   *   server can detect duplicates without maintaining session state.
   */
  @Post('guess')
  async guess(@Body() dto: RosterGuessDto): Promise<RosterGuessResponseDto> {
    return this.rosterService.guess(dto);
  }
}
