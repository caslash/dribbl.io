import { Season, Team } from '@dribblio/types';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FranchisePoolGenerator } from './franchise.generator';

const makeQueryBuilder = (seasons: Partial<Season>[]) => {
  const qb = {
    innerJoinAndSelect: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    andWhere: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    addOrderBy: vi.fn().mockReturnThis(),
    getMany: vi.fn().mockResolvedValue(seasons),
  };
  return qb;
};

const makeTeam = (overrides: Partial<Team> = {}): Team => ({
  teamId: 1610612747,
  abbreviation: 'LAL',
  fullName: 'Los Angeles Lakers',
  nickname: 'Lakers',
  city: 'Los Angeles',
  state: 'California',
  yearFounded: 1947,
  players: [],
  ...overrides,
});

const makePlayer = (overrides: Partial<Season['player']> = {}) => ({
  playerId: 2544,
  fullName: 'LeBron James',
  ...overrides,
});

const makeSeason = (overrides: Partial<Season> = {}): Partial<Season> => ({
  playerId: 2544,
  teamId: 1610612747,
  seasonId: '2018-19',
  seasonType: 'Regular Season',
  teamAbbreviation: 'LAL',
  player: makePlayer() as Season['player'],
  team: makeTeam() as Team,
  ...overrides,
});

describe('FranchisePoolGenerator', () => {
  let generator: FranchisePoolGenerator;
  let mockSeasonRepository: { createQueryBuilder: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    const qb = makeQueryBuilder([makeSeason()]);
    mockSeasonRepository = {
      createQueryBuilder: vi.fn().mockReturnValue(qb),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FranchisePoolGenerator,
        {
          provide: getRepositoryToken(Season),
          useValue: mockSeasonRepository,
        },
      ],
    }).compile();

    generator = module.get<FranchisePoolGenerator>(FranchisePoolGenerator);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generate', () => {
    it('returns a correctly shaped FranchisePoolEntry for a single season row', async () => {
      const season = makeSeason();
      mockSeasonRepository.createQueryBuilder.mockReturnValue(
        makeQueryBuilder([season]),
      );

      const results = await generator.generate();

      expect(results).toHaveLength(1);
      expect(results[0]).toMatchObject({
        entryId: '2544-1610612747',
        draftMode: 'franchise',
        playerId: 2544,
        playerName: 'LeBron James',
        franchiseName: 'Los Angeles Lakers',
        franchiseAbbr: 'LAL',
        available: true,
      });
    });

    it('deduplicates — a player who played for the same team across multiple seasons produces only one entry', async () => {
      const seasons = [
        makeSeason({ seasonId: '2018-19' }),
        makeSeason({ seasonId: '2019-20' }),
        makeSeason({ seasonId: '2020-21' }),
      ];
      mockSeasonRepository.createQueryBuilder.mockReturnValue(
        makeQueryBuilder(seasons),
      );

      const results = await generator.generate();

      expect(results).toHaveLength(1);
      expect(results[0].entryId).toBe('2544-1610612747');
    });

    it('produces two entries for a player who played for two different teams', async () => {
      const seasons = [
        makeSeason({
          teamId: 1610612739,
          teamAbbreviation: 'CLE',
          team: makeTeam({
            teamId: 1610612739,
            abbreviation: 'CLE',
            fullName: 'Cleveland Cavaliers',
          }),
          seasonId: '2015-16',
        }),
        makeSeason({
          teamId: 1610612747,
          teamAbbreviation: 'LAL',
          team: makeTeam(),
          seasonId: '2018-19',
        }),
      ];
      mockSeasonRepository.createQueryBuilder.mockReturnValue(
        makeQueryBuilder(seasons),
      );

      const results = await generator.generate();

      expect(results).toHaveLength(2);
      const entryIds = results.map((e) => e.entryId);
      expect(entryIds).toContain('2544-1610612739');
      expect(entryIds).toContain('2544-1610612747');
    });

    it('uses {playerId}-{teamId} as the entryId', async () => {
      const season = makeSeason({ playerId: 201939, teamId: 1610612744 });
      mockSeasonRepository.createQueryBuilder.mockReturnValue(
        makeQueryBuilder([season]),
      );

      const results = await generator.generate();

      expect(results[0].entryId).toBe('201939-1610612744');
    });

    it('marks every returned entry as available', async () => {
      const seasons = [
        makeSeason({ seasonId: '2018-19' }),
        makeSeason({
          playerId: 201939,
          teamId: 1610612744,
          player: makePlayer({
            playerId: 201939,
            fullName: 'Stephen Curry',
          }) as Season['player'],
          team: makeTeam({
            teamId: 1610612744,
            abbreviation: 'GSW',
            fullName: 'Golden State Warriors',
          }),
        }),
      ];
      mockSeasonRepository.createQueryBuilder.mockReturnValue(
        makeQueryBuilder(seasons),
      );

      const results = await generator.generate();

      expect(results.every((e) => e.available === true)).toBe(true);
    });

    it('returns an empty array when the query returns no seasons', async () => {
      mockSeasonRepository.createQueryBuilder.mockReturnValue(
        makeQueryBuilder([]),
      );

      const results = await generator.generate();

      expect(results).toEqual([]);
    });

    it('queries only Regular Season rows', async () => {
      const qb = makeQueryBuilder([]);
      mockSeasonRepository.createQueryBuilder.mockReturnValue(qb);

      await generator.generate();

      expect(qb.where).toHaveBeenCalledWith('season.seasonType = :type', {
        type: 'Regular Season',
      });
    });

    it('excludes TOT rows from the query', async () => {
      const qb = makeQueryBuilder([]);
      mockSeasonRepository.createQueryBuilder.mockReturnValue(qb);

      await generator.generate();

      expect(qb.andWhere).toHaveBeenCalledWith(
        'season.teamAbbreviation != :tot',
        { tot: 'TOT' },
      );
    });

    it('produces distinct entries for multiple players', async () => {
      const seasons = [
        makeSeason({
          playerId: 2544,
          teamId: 1610612747,
          player: makePlayer() as Season['player'],
          team: makeTeam(),
        }),
        makeSeason({
          playerId: 201939,
          teamId: 1610612744,
          teamAbbreviation: 'GSW',
          player: makePlayer({
            playerId: 201939,
            fullName: 'Stephen Curry',
          }) as Season['player'],
          team: makeTeam({
            teamId: 1610612744,
            abbreviation: 'GSW',
            fullName: 'Golden State Warriors',
          }),
        }),
        makeSeason({
          playerId: 977,
          teamId: 1610612738,
          teamAbbreviation: 'BOS',
          player: makePlayer({
            playerId: 977,
            fullName: 'Paul Pierce',
          }) as Season['player'],
          team: makeTeam({
            teamId: 1610612738,
            abbreviation: 'BOS',
            fullName: 'Boston Celtics',
          }),
        }),
      ];
      mockSeasonRepository.createQueryBuilder.mockReturnValue(
        makeQueryBuilder(seasons),
      );

      const results = await generator.generate();

      expect(results).toHaveLength(3);
      expect(results.map((e) => e.playerId)).toEqual(
        expect.arrayContaining([2544, 201939, 977]),
      );
    });

    it('does not deduplicate across different players on the same team', async () => {
      const seasons = [
        makeSeason({
          playerId: 2544,
          teamId: 1610612747,
          player: makePlayer() as Season['player'],
          team: makeTeam(),
        }),
        makeSeason({
          playerId: 2200,
          teamId: 1610612747,
          teamAbbreviation: 'LAL',
          player: makePlayer({
            playerId: 2200,
            fullName: 'Kobe Bryant',
          }) as Season['player'],
          team: makeTeam(),
        }),
      ];
      mockSeasonRepository.createQueryBuilder.mockReturnValue(
        makeQueryBuilder(seasons),
      );

      const results = await generator.generate();

      expect(results).toHaveLength(2);
    });
  });
});
