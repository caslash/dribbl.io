import { DailyChallenge, Player, Team } from '@dribblio/types';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DailyScheduleService } from '@/nba/daily/daily-schedule.service';
import { RosterService } from './roster.service';

// ---------------------------------------------------------------------------
// Factories
// ---------------------------------------------------------------------------

function makeChallenge(overrides: Partial<DailyChallenge> = {}): DailyChallenge {
  return {
    id: 'chal-uuid-1',
    gameType: 'roster',
    challengeDate: '2026-03-22',
    teamId: 1610612747,
    seasonId: '2023-24',
    curated: false,
    createdAt: new Date('2026-01-01'),
    team: {} as Team,
    ...overrides,
  };
}

function makeTeam(overrides: Partial<Team> = {}): Team {
  return {
    teamId: 1610612747,
    abbreviation: 'LAL',
    nickname: 'Lakers',
    city: 'Los Angeles',
    state: 'California',
    fullName: 'Los Angeles Lakers',
    yearFounded: 1947,
    players: [],
    ...overrides,
  };
}

function makePlayer(
  playerId: number,
  fullName: string,
  overrides: Partial<Player> = {},
): Player {
  return {
    playerId,
    firstName: fullName.split(' ')[0],
    lastName: fullName.split(' ')[1] ?? '',
    fullName,
    isActive: true,
    position: 'F',
    jerseyNumber: '23',
    birthdate: null,
    school: null,
    country: null,
    height: null,
    weightLbs: null,
    teamId: null,
    draftYear: null,
    draftRound: null,
    draftNumber: null,
    fromYear: null,
    toYear: null,
    greatest75Flag: false,
    updatedAt: new Date(),
    seasons: [],
    accolades: [],
    team: null,
    ...overrides,
  };
}

/**
 * Builds a mock query builder matching the exact chain used by `loadRoster`:
 * innerJoin → select → distinct → getMany.
 */
function makeQueryBuilder(players: Player[]) {
  return {
    innerJoin: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    distinct: vi.fn().mockReturnThis(),
    getMany: vi.fn().mockResolvedValue(players),
  };
}

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockDailyScheduleService = {
  lookupByDate: vi.fn(),
};

const mockPlayerRepo = {
  findOne: vi.fn(),
  createQueryBuilder: vi.fn(),
};

const mockTeamRepo = {
  findOne: vi.fn(),
};

// ---------------------------------------------------------------------------
// Helper to reach the private cache field in tests
// ---------------------------------------------------------------------------

type ServiceWithCache = RosterService & {
  cache: { date: string; challenge: DailyChallenge; team: Team; roster: Player[] } | null;
};

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

describe('RosterService', () => {
  let service: RosterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RosterService,
        { provide: DailyScheduleService, useValue: mockDailyScheduleService },
        { provide: getRepositoryToken(Player), useValue: mockPlayerRepo },
        { provide: getRepositoryToken(Team), useValue: mockTeamRepo },
      ],
    }).compile();

    service = module.get<RosterService>(RosterService);
  });

  beforeEach(() => {
    vi.clearAllMocks();

    // Default: a valid challenge exists for today with one roster player.
    mockDailyScheduleService.lookupByDate.mockResolvedValue(makeChallenge());
    mockTeamRepo.findOne.mockResolvedValue(makeTeam());
    mockPlayerRepo.createQueryBuilder.mockReturnValue(
      makeQueryBuilder([makePlayer(2544, 'LeBron James')]),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // -------------------------------------------------------------------------
  // getTodayChallenge
  // -------------------------------------------------------------------------

  describe('getTodayChallenge', () => {
    it('returns null without querying team or roster when no challenge is scheduled', async () => {
      mockDailyScheduleService.lookupByDate.mockResolvedValue(null);

      const result = await service.getTodayChallenge();

      expect(result).toBeNull();
      expect(mockTeamRepo.findOne).not.toHaveBeenCalled();
      expect(mockPlayerRepo.createQueryBuilder).not.toHaveBeenCalled();
    });

    it('returns null when the challenge exists but the team record is missing', async () => {
      mockTeamRepo.findOne.mockResolvedValue(null);

      const result = await service.getTodayChallenge();

      expect(result).toBeNull();
    });

    it('returns { challenge, team, rosterSize } for a scheduled challenge', async () => {
      const challenge = makeChallenge();
      const team = makeTeam();
      const players = [
        makePlayer(2544, 'LeBron James'),
        makePlayer(977, 'Anthony Davis'),
      ];
      mockDailyScheduleService.lookupByDate.mockResolvedValue(challenge);
      mockTeamRepo.findOne.mockResolvedValue(team);
      mockPlayerRepo.createQueryBuilder.mockReturnValue(
        makeQueryBuilder(players),
      );

      const result = await service.getTodayChallenge();

      expect(result).not.toBeNull();
      expect(result!.challenge).toBe(challenge);
      expect(result!.team).toBe(team);
      expect(result!.rosterSize).toBe(2);
    });

    it('calls lookupByDate with gameType "roster" and today\'s ISO date', async () => {
      const today = new Date().toISOString().slice(0, 10);

      await service.getTodayChallenge();

      expect(mockDailyScheduleService.lookupByDate).toHaveBeenCalledWith(
        'roster',
        today,
      );
    });

    it('queries the team repo using the challenge teamId', async () => {
      mockDailyScheduleService.lookupByDate.mockResolvedValue(
        makeChallenge({ teamId: 1610612738 }),
      );

      await service.getTodayChallenge();

      expect(mockTeamRepo.findOne).toHaveBeenCalledWith({
        where: { teamId: 1610612738 },
      });
    });

    it('returns the cached result on a second call without re-querying the DB', async () => {
      await service.getTodayChallenge();
      await service.getTodayChallenge();

      expect(mockDailyScheduleService.lookupByDate).toHaveBeenCalledTimes(1);
      expect(mockTeamRepo.findOne).toHaveBeenCalledTimes(1);
      expect(mockPlayerRepo.createQueryBuilder).toHaveBeenCalledTimes(1);
    });

    it('re-queries when the cached date no longer matches today', async () => {
      await service.getTodayChallenge();
      (service as ServiceWithCache).cache!.date = '2000-01-01';

      await service.getTodayChallenge();

      expect(mockDailyScheduleService.lookupByDate).toHaveBeenCalledTimes(2);
      expect(mockTeamRepo.findOne).toHaveBeenCalledTimes(2);
      expect(mockPlayerRepo.createQueryBuilder).toHaveBeenCalledTimes(2);
    });
  });

  // -------------------------------------------------------------------------
  // guess
  // -------------------------------------------------------------------------

  describe('guess', () => {
    it('throws NotFoundException when no challenge exists for today', async () => {
      mockDailyScheduleService.lookupByDate.mockResolvedValue(null);

      await expect(
        service.guess({ guessId: 2544, namedIds: [] }),
      ).rejects.toThrow(NotFoundException);
    });

    it('returns { correct: false, rosterSize } when the player does not exist in the DB', async () => {
      mockPlayerRepo.findOne.mockResolvedValue(null);

      const result = await service.guess({ guessId: 99999, namedIds: [] });

      expect(result).toEqual({ correct: false, rosterSize: 1 });
    });

    it('returns { correct: false, rosterSize } when the player is not on the roster', async () => {
      // Player exists in the DB but is not part of the loaded roster.
      mockPlayerRepo.findOne.mockResolvedValue(makePlayer(1, 'Some Player'));

      const result = await service.guess({ guessId: 1, namedIds: [] });

      expect(result).toEqual({ correct: false, rosterSize: 1 });
    });

    it('returns correct result with updated namedIds on a correct non-duplicate guess', async () => {
      const lebron = makePlayer(2544, 'LeBron James', {
        position: 'F',
        jerseyNumber: '23',
      });
      mockPlayerRepo.findOne.mockResolvedValue(lebron);

      const result = await service.guess({ guessId: 2544, namedIds: [] });

      expect(result).toEqual({
        correct: true,
        player: {
          playerId: 2544,
          fullName: 'LeBron James',
          position: 'F',
          jerseyNumber: '23',
        },
        namedIds: [2544],
        rosterSize: 1,
      });
    });

    it('appends guessId to the existing namedIds list on a correct non-duplicate guess', async () => {
      const players = [
        makePlayer(2544, 'LeBron James'),
        makePlayer(977, 'Anthony Davis'),
      ];
      mockPlayerRepo.createQueryBuilder.mockReturnValue(
        makeQueryBuilder(players),
      );
      const ad = makePlayer(977, 'Anthony Davis', {
        position: 'C',
        jerseyNumber: '3',
      });
      mockPlayerRepo.findOne.mockResolvedValue(ad);

      const result = await service.guess({ guessId: 977, namedIds: [2544] });

      expect(result.correct).toBe(true);
      expect((result as { namedIds: number[] }).namedIds).toEqual([2544, 977]);
    });

    it('returns { correct: true, duplicate: true, player, rosterSize } when guessId is already in namedIds', async () => {
      const lebron = makePlayer(2544, 'LeBron James', {
        position: 'F',
        jerseyNumber: '23',
      });
      mockPlayerRepo.findOne.mockResolvedValue(lebron);

      const result = await service.guess({ guessId: 2544, namedIds: [2544] });

      expect(result).toEqual({
        correct: true,
        duplicate: true,
        player: {
          playerId: 2544,
          fullName: 'LeBron James',
          position: 'F',
          jerseyNumber: '23',
        },
        rosterSize: 1,
      });
      expect((result as { namedIds?: number[] }).namedIds).toBeUndefined();
    });

    it('does not re-load the roster from the DB on each guess call', async () => {
      mockPlayerRepo.findOne.mockResolvedValue(makePlayer(2544, 'LeBron James'));

      await service.guess({ guessId: 2544, namedIds: [] });
      await service.guess({ guessId: 2544, namedIds: [2544] });

      // createQueryBuilder is called once during cache prime — never again.
      expect(mockPlayerRepo.createQueryBuilder).toHaveBeenCalledTimes(1);
    });

    it('only selects the player fields required by the response shape', async () => {
      mockPlayerRepo.findOne.mockResolvedValue(makePlayer(2544, 'LeBron James'));

      await service.guess({ guessId: 2544, namedIds: [] });

      expect(mockPlayerRepo.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          select: ['playerId', 'fullName', 'position', 'jerseyNumber'],
        }),
      );
    });
  });

  // -------------------------------------------------------------------------
  // Cache invalidation via date change
  // -------------------------------------------------------------------------

  describe('cache invalidation', () => {
    it('re-queries on the first call after the cached date becomes stale', async () => {
      await service.getTodayChallenge();
      (service as ServiceWithCache).cache!.date = '2000-01-01';

      await service.getTodayChallenge();

      expect(mockDailyScheduleService.lookupByDate).toHaveBeenCalledTimes(2);
    });

    it('returns null without populating cache when the fresh lookup finds no challenge', async () => {
      await service.getTodayChallenge();
      (service as ServiceWithCache).cache!.date = '2000-01-01';
      mockDailyScheduleService.lookupByDate.mockResolvedValue(null);

      const result = await service.getTodayChallenge();

      expect(result).toBeNull();
    });
  });
});
