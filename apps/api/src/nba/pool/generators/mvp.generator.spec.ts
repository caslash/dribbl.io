import { vi } from 'vitest';
import { Season } from '@dribblio/types';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MvpPoolGenerator } from './mvp.generator';

const makeQueryBuilder = (seasons: Partial<Season>[]) => {
  const qb = {
    innerJoin: vi.fn().mockReturnThis(),
    innerJoinAndSelect: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    getMany: vi.fn().mockResolvedValue(seasons),
  };
  return qb;
};

const makePlayer = (overrides: Partial<Season['player']> = {}) => ({
  playerId: 2544,
  fullName: 'LeBron James',
  ...overrides,
});

const makeSeason = (overrides: Partial<Season> = {}): Partial<Season> => ({
  playerId: 2544,
  seasonId: '2011-12',
  seasonType: 'Regular Season',
  ptsPg: 27.1,
  astPg: 6.2,
  rebPg: 7.9,
  player: makePlayer() as Season['player'],
  ...overrides,
});

describe('MvpPoolGenerator', () => {
  let generator: MvpPoolGenerator;
  let mockSeasonRepository: ReturnType<typeof vi.fn> & {
    createQueryBuilder: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    const qb = makeQueryBuilder([makeSeason()]);
    mockSeasonRepository = {
      createQueryBuilder: vi.fn().mockReturnValue(qb),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MvpPoolGenerator,
        {
          provide: getRepositoryToken(Season),
          useValue: mockSeasonRepository,
        },
      ],
    }).compile();

    generator = module.get<MvpPoolGenerator>(MvpPoolGenerator);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generate', () => {
    it('returns an mvp pool entry with ptsPg, astPg, and rebPg when all stats are present', async () => {
      const season = makeSeason({ ptsPg: 27.1, astPg: 6.2, rebPg: 7.9 });
      mockSeasonRepository.createQueryBuilder.mockReturnValue(
        makeQueryBuilder([season]),
      );

      const results = await generator.generate();

      expect(results).toHaveLength(1);
      expect(results[0]).toMatchObject({
        entryId: '2544-2011-12',
        draftMode: 'mvp',
        playerId: 2544,
        playerName: 'LeBron James',
        season: '2011-12',
        ptsPg: 27.1,
        astPg: 6.2,
        rebPg: 7.9,
        available: true,
      });
    });

    it('returns null for ptsPg, astPg, and rebPg when the season has no stat data', async () => {
      const season = makeSeason({ ptsPg: null, astPg: null, rebPg: null });
      mockSeasonRepository.createQueryBuilder.mockReturnValue(
        makeQueryBuilder([season]),
      );

      const results = await generator.generate();

      expect(results).toHaveLength(1);
      expect(results[0].ptsPg).toBeNull();
      expect(results[0].astPg).toBeNull();
      expect(results[0].rebPg).toBeNull();
    });

    it('returns null only for the missing stat when some stats are present and others are null', async () => {
      const season = makeSeason({ ptsPg: 30.0, astPg: null, rebPg: 8.5 });
      mockSeasonRepository.createQueryBuilder.mockReturnValue(
        makeQueryBuilder([season]),
      );

      const results = await generator.generate();

      expect(results[0].ptsPg).toBe(30.0);
      expect(results[0].astPg).toBeNull();
      expect(results[0].rebPg).toBe(8.5);
    });

    it('returns an entry for every season returned by the query', async () => {
      const seasons = [
        makeSeason({
          seasonId: '2011-12',
          player: makePlayer() as Season['player'],
        }),
        makeSeason({
          playerId: 201939,
          seasonId: '2016-17',
          player: makePlayer({
            playerId: 201939,
            fullName: 'Stephen Curry',
          }) as Season['player'],
        }),
      ];
      mockSeasonRepository.createQueryBuilder.mockReturnValue(
        makeQueryBuilder(seasons),
      );

      const results = await generator.generate();

      expect(results).toHaveLength(2);
      expect(results[0].entryId).toBe('2544-2011-12');
      expect(results[1].entryId).toBe('201939-2016-17');
    });

    it('returns an empty array when the query returns no seasons', async () => {
      mockSeasonRepository.createQueryBuilder.mockReturnValue(
        makeQueryBuilder([]),
      );

      const results = await generator.generate();

      expect(results).toEqual([]);
    });

    it('marks every returned entry as available', async () => {
      const seasons = [makeSeason(), makeSeason({ seasonId: '2012-13' })];
      mockSeasonRepository.createQueryBuilder.mockReturnValue(
        makeQueryBuilder(seasons),
      );

      const results = await generator.generate();

      expect(results.every((e) => e.available === true)).toBe(true);
    });

    it('queries only Regular Season rows filtered by NBA MVP accolade', async () => {
      const qb = makeQueryBuilder([]);
      mockSeasonRepository.createQueryBuilder.mockReturnValue(qb);

      await generator.generate();

      expect(qb.where).toHaveBeenCalledWith('season.seasonType = :type', {
        type: 'Regular Season',
      });
      expect(qb.innerJoin).toHaveBeenCalledWith(
        expect.anything(),
        'accolade',
        expect.stringContaining('accolade.description ILIKE :mvp'),
        expect.objectContaining({ mvp: '%NBA Most Valuable Player%' }),
      );
    });
  });
});
