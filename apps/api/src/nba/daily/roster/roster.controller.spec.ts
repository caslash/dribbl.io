import {
  DailyChallengeDto,
  RosterGuessDto,
  RosterGuessResponseDto,
  RosterRevealDto,
} from '@dribblio/types';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RosterService } from '@/nba/daily/roster/roster.service';
import { RosterController } from './roster.controller';

// ---------------------------------------------------------------------------
// Factories
// ---------------------------------------------------------------------------

function makeTodayResult(): {
  challenge: { challengeDate: string; teamId: number; seasonId: string };
  team: { fullName: string; abbreviation: string };
  rosterSize: number;
} {
  return {
    challenge: {
      challengeDate: '2026-03-22',
      teamId: 1610612747,
      seasonId: '2023-24',
    },
    team: {
      fullName: 'Los Angeles Lakers',
      abbreviation: 'LAL',
    },
    rosterSize: 15,
  };
}

function makeExpectedDto(): DailyChallengeDto {
  const { challenge, team, rosterSize } = makeTodayResult();
  return {
    challengeDate: challenge.challengeDate,
    teamId: challenge.teamId,
    teamFullName: team.fullName,
    teamAbbreviation: team.abbreviation,
    seasonId: challenge.seasonId,
    rosterSize,
  };
}

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockRosterService = {
  getChallenge: vi.fn(),
  getReveal: vi.fn(),
  guess: vi.fn(),
};

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

describe('RosterController', () => {
  let controller: RosterController;
  let service: RosterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RosterController],
      providers: [
        { provide: RosterService, useValue: mockRosterService },
      ],
    }).compile();

    controller = module.get<RosterController>(RosterController);
    service = module.get(RosterService);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // -------------------------------------------------------------------------
  // GET /daily/roster/today
  // -------------------------------------------------------------------------

  describe('getToday', () => {
    it('returns a DailyChallengeDto when a challenge exists for today', async () => {
      mockRosterService.getChallenge.mockResolvedValue(makeTodayResult());

      const result = await controller.getToday();

      expect(result).toEqual(makeExpectedDto());
    });

    it('throws NotFoundException with { error: "NO_CHALLENGE" } when no challenge is scheduled', async () => {
      mockRosterService.getChallenge.mockResolvedValue(null);

      await expect(controller.getToday()).rejects.toThrow(NotFoundException);
      await expect(controller.getToday()).rejects.toMatchObject({
        response: { error: 'NO_CHALLENGE' },
      });
    });

    it('delegates to rosterService.getChallenge', async () => {
      mockRosterService.getChallenge.mockResolvedValue(makeTodayResult());

      await controller.getToday();

      expect(service.getChallenge).toHaveBeenCalledTimes(1);
    });

    it('maps all fields from challenge and team onto the DTO', async () => {
      const todayResult = {
        challenge: {
          challengeDate: '2026-04-01',
          teamId: 1610612738,
          seasonId: '2000-01',
        },
        team: { fullName: 'Boston Celtics', abbreviation: 'BOS' },
        rosterSize: 12,
      };
      mockRosterService.getChallenge.mockResolvedValue(todayResult);

      const result = await controller.getToday();

      expect(result).toEqual({
        challengeDate: '2026-04-01',
        teamId: 1610612738,
        teamFullName: 'Boston Celtics',
        teamAbbreviation: 'BOS',
        seasonId: '2000-01',
        rosterSize: 12,
      });
    });
  });

  // -------------------------------------------------------------------------
  // GET /daily/roster/today/reveal
  // -------------------------------------------------------------------------

  describe('getTodayReveal', () => {
    it('returns a RosterRevealDto when the service returns players', async () => {
      const reveal: RosterRevealDto = {
        players: [
          { playerId: 2544, fullName: 'LeBron James', position: 'F', jerseyNumber: '23' },
          { playerId: 977, fullName: 'Anthony Davis', position: 'C', jerseyNumber: '3' },
        ],
      };
      mockRosterService.getReveal.mockResolvedValue(reveal);

      const result = await controller.getTodayReveal();

      expect(result).toBe(reveal);
    });

    it('throws NotFoundException with { error: "NO_CHALLENGE" } when service returns null', async () => {
      mockRosterService.getReveal.mockResolvedValue(null);

      await expect(controller.getTodayReveal()).rejects.toThrow(NotFoundException);
      await expect(controller.getTodayReveal()).rejects.toMatchObject({
        response: { error: 'NO_CHALLENGE' },
      });
    });

    it('delegates to rosterService.getReveal', async () => {
      mockRosterService.getReveal.mockResolvedValue({ players: [] });

      await controller.getTodayReveal();

      expect(service.getReveal).toHaveBeenCalledTimes(1);
    });
  });

  // -------------------------------------------------------------------------
  // POST /daily/roster/guess
  // -------------------------------------------------------------------------

  describe('guess', () => {
    it('delegates to rosterService.guess with the provided DTO and returns the result', async () => {
      const dto: RosterGuessDto = { guessId: 2544, namedIds: [] };
      const response: RosterGuessResponseDto = {
        correct: true,
        player: {
          playerId: 2544,
          fullName: 'LeBron James',
          position: 'F',
          jerseyNumber: '23',
        },
        namedIds: [2544],
        rosterSize: 15,
      };
      mockRosterService.guess.mockResolvedValue(response);

      const result = await controller.guess(dto);

      expect(service.guess).toHaveBeenCalledWith(dto, expect.any(String));
      expect(result).toBe(response);
    });

    it('returns { correct: false, rosterSize } for an incorrect guess', async () => {
      const dto: RosterGuessDto = { guessId: 1, namedIds: [] };
      const response: RosterGuessResponseDto = { correct: false, rosterSize: 15 };
      mockRosterService.guess.mockResolvedValue(response);

      const result = await controller.guess(dto);

      expect(result).toEqual({ correct: false, rosterSize: 15 });
    });

    it('returns a duplicate result when the service signals a duplicate guess', async () => {
      const dto: RosterGuessDto = { guessId: 2544, namedIds: [2544] };
      const response: RosterGuessResponseDto = {
        correct: true,
        duplicate: true,
        player: {
          playerId: 2544,
          fullName: 'LeBron James',
          position: 'F',
          jerseyNumber: '23',
        },
        rosterSize: 15,
      };
      mockRosterService.guess.mockResolvedValue(response);

      const result = await controller.guess(dto);

      expect(result).toBe(response);
    });

    it('propagates NotFoundException thrown by rosterService.guess', async () => {
      const dto: RosterGuessDto = { guessId: 1, namedIds: [] };
      mockRosterService.guess.mockRejectedValue(
        new NotFoundException({ error: 'NO_CHALLENGE' }),
      );

      await expect(controller.guess(dto)).rejects.toThrow(NotFoundException);
    });
  });
});
