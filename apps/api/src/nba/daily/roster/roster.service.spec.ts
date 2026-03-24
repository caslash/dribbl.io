import { DailyChallenge, Season, Team } from '@dribblio/types';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DailyScheduleService } from '@/nba/daily/daily-schedule.service';
import { RosterService } from './roster.service';

// ---------------------------------------------------------------------------
// Local type alias matching the private RosterPlayer interface in the service
// ---------------------------------------------------------------------------

type RosterPlayer = {
  playerId: number;
  fullName: string;
  position: string | null;
  jerseyNumber: string | null;
  ptsPg?: number | null;
  astPg?: number | null;
  rebPg?: number | null;
};

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

/**
 * Builds a minimal Season object suitable for `seasonRepo.find` mock returns.
 * Fills all four primary key columns required by the entity.
 *
 * @param playerId - The player's numeric ID.
 * @param fullName - The player's full name (populates the nested relation).
 * @param overrides - Optional field overrides applied to the season row.
 */
function makeSeason(
  playerId: number,
  fullName: string,
  overrides: Partial<Season> = {},
): Season {
  return {
    playerId,
    seasonId: '2023-24',
    teamAbbreviation: 'LAL',
    seasonType: 'Regular Season',
    teamId: 1610612747,
    playerAge: null,
    gp: 5,
    gs: null,
    minPg: null,
    fgmPg: null,
    fgaPg: null,
    fg3mPg: null,
    fg3aPg: null,
    ftmPg: null,
    ftaPg: null,
    orebPg: null,
    drebPg: null,
    rebPg: null,
    astPg: null,
    stlPg: null,
    blkPg: null,
    tovPg: null,
    pfPg: null,
    ptsPg: null,
    fgPct: null,
    fg3Pct: null,
    ftPct: null,
    jerseyNumber: '23',
    player: {
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
    },
    team: null,
    ...overrides,
  } as Season;
}

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockDailyScheduleService = {
  lookupByDate: vi.fn(),
  getEarliestDate: vi.fn(),
};

const mockSeasonRepo = {
  find: vi.fn(),
};

const mockTeamRepo = {
  findOne: vi.fn(),
};

// ---------------------------------------------------------------------------
// Helper to reach the private cache field in tests
// ---------------------------------------------------------------------------

type ServiceWithCache = RosterService & {
  cache: {
    date: string;
    challenge: DailyChallenge;
    team: Team;
    roster: RosterPlayer[];
  } | null;
};

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

const TODAY = new Date().toLocaleDateString('en-CA');

describe('RosterService', () => {
  let service: RosterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RosterService,
        { provide: DailyScheduleService, useValue: mockDailyScheduleService },
        { provide: getRepositoryToken(Season), useValue: mockSeasonRepo },
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
    mockSeasonRepo.find.mockResolvedValue([makeSeason(2544, 'LeBron James')]);
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
      expect(mockSeasonRepo.find).not.toHaveBeenCalled();
    });

    it('returns null when the challenge exists but the team record is missing', async () => {
      mockTeamRepo.findOne.mockResolvedValue(null);

      const result = await service.getTodayChallenge();

      expect(result).toBeNull();
    });

    it('returns { challenge, team, rosterSize } for a scheduled challenge', async () => {
      const challenge = makeChallenge();
      const team = makeTeam();
      mockDailyScheduleService.lookupByDate.mockResolvedValue(challenge);
      mockTeamRepo.findOne.mockResolvedValue(team);
      mockSeasonRepo.find.mockResolvedValue([
        makeSeason(2544, 'LeBron James'),
        makeSeason(977, 'Anthony Davis'),
      ]);

      const result = await service.getTodayChallenge();

      expect(result).not.toBeNull();
      expect(result!.challenge).toBe(challenge);
      expect(result!.team).toBe(team);
      expect(result!.rosterSize).toBe(2);
    });

    it('calls lookupByDate with gameType "roster" and today\'s date', async () => {
      await service.getTodayChallenge();

      expect(mockDailyScheduleService.lookupByDate).toHaveBeenCalledWith(
        'roster',
        TODAY,
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
      expect(mockSeasonRepo.find).toHaveBeenCalledTimes(1);
    });

    it('re-queries when the cached date no longer matches today', async () => {
      await service.getTodayChallenge();
      (service as ServiceWithCache).cache!.date = '2000-01-01';

      await service.getTodayChallenge();

      expect(mockDailyScheduleService.lookupByDate).toHaveBeenCalledTimes(2);
      expect(mockTeamRepo.findOne).toHaveBeenCalledTimes(2);
      expect(mockSeasonRepo.find).toHaveBeenCalledTimes(2);
    });

    it('excludes season rows with 0 games played from the roster count', async () => {
      mockSeasonRepo.find.mockResolvedValue([
        makeSeason(2544, 'LeBron James', { gp: 0 }),
        makeSeason(977, 'Anthony Davis', { gp: 5 }),
      ]);

      const result = await service.getTodayChallenge();

      expect(result!.rosterSize).toBe(1);
    });

    it('excludes season rows with null gp from the roster count', async () => {
      mockSeasonRepo.find.mockResolvedValue([
        makeSeason(2544, 'LeBron James', { gp: null }),
        makeSeason(977, 'Anthony Davis', { gp: 3 }),
      ]);

      const result = await service.getTodayChallenge();

      expect(result!.rosterSize).toBe(1);
    });
  });

  // -------------------------------------------------------------------------
  // guess
  // -------------------------------------------------------------------------

  describe('guess', () => {
    it('throws NotFoundException when no challenge exists for today', async () => {
      mockDailyScheduleService.lookupByDate.mockResolvedValue(null);

      await expect(
        service.guess({ guessId: 2544, namedIds: [] }, TODAY),
      ).rejects.toThrow(NotFoundException);
    });

    it('returns { correct: false, rosterSize } when the player is not on the roster', async () => {
      // Cache is primed with LeBron only; guessing an unknown player ID returns false.
      await service.getTodayChallenge();

      const result = await service.guess({ guessId: 99999, namedIds: [] }, TODAY);

      expect(result).toEqual({ correct: false, rosterSize: 1 });
    });

    it('returns correct result with updated namedIds on a correct non-duplicate guess', async () => {
      await service.getTodayChallenge();
      // Override the cached roster to control the exact shape returned.
      (service as ServiceWithCache).cache!.roster = [
        { playerId: 2544, fullName: 'LeBron James', position: 'F', jerseyNumber: '23' },
      ];

      const result = await service.guess({ guessId: 2544, namedIds: [] }, TODAY);

      expect(result).toEqual({
        correct: true,
        index: 0,
        player: {
          playerId: 2544,
          fullName: 'LeBron James',
          position: 'F',
          jerseyNumber: '23',
          ptsPg: undefined,
          astPg: undefined,
          rebPg: undefined,
        },
        namedIds: [2544],
        rosterSize: 1,
      });
    });

    it('appends guessId to the existing namedIds list on a correct non-duplicate guess', async () => {
      await service.getTodayChallenge();
      (service as ServiceWithCache).cache!.roster = [
        { playerId: 2544, fullName: 'LeBron James', position: 'F', jerseyNumber: '23' },
        { playerId: 977, fullName: 'Anthony Davis', position: 'C', jerseyNumber: '3' },
      ];

      const result = await service.guess({ guessId: 977, namedIds: [2544] }, TODAY);

      expect(result.correct).toBe(true);
      expect((result as { namedIds: number[] }).namedIds).toEqual([2544, 977]);
    });

    it('returns { correct: true, duplicate: true, player, rosterSize } when guessId is already in namedIds', async () => {
      await service.getTodayChallenge();
      (service as ServiceWithCache).cache!.roster = [
        { playerId: 2544, fullName: 'LeBron James', position: 'F', jerseyNumber: '23' },
      ];

      const result = await service.guess({ guessId: 2544, namedIds: [2544] }, TODAY);

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
      await service.getTodayChallenge();

      await service.guess({ guessId: 2544, namedIds: [] }, TODAY);
      await service.guess({ guessId: 2544, namedIds: [2544] }, TODAY);

      // seasonRepo.find is called once during cache prime — never again.
      expect(mockSeasonRepo.find).toHaveBeenCalledTimes(1);
    });

    it('uses the jersey number from the season row, not a separate player record', async () => {
      mockSeasonRepo.find.mockResolvedValue([
        makeSeason(2544, 'LeBron James', { jerseyNumber: '6' }),
      ]);
      await service.getTodayChallenge();

      const result = await service.guess({ guessId: 2544, namedIds: [] }, TODAY);

      expect(result.correct).toBe(true);
      expect((result as { player: RosterPlayer }).player.jerseyNumber).toBe('6');
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
