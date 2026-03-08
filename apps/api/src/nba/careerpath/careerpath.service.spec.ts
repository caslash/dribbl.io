import { CareerPathService } from '@/nba/careerpath/careerpath.service';
import { createCareerPathMachine } from '@/nba/careerpath/machine/statemachine';
import { PlayerService } from '@/nba/player/player.service';
import { GameDifficulty, Player, Season } from '@dribblio/types';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

vi.mock('@/nba/careerpath/machine/statemachine');

const mockPlayerRepository = {
  find: vi.fn(),
  findOne: vi.fn(),
  findBy: vi.fn(),
  query: vi.fn(),
};

const mockPlayerService = {
  findRandomPlayer: vi.fn(),
};

const mockDifficulty: GameDifficulty = {
  name: 'test',
  display_name: 'Test',
  description: 'Test difficulty',
  filter: (qb) => qb,
};

const makePlayer = (overrides: Partial<Player> = {}): Player =>
  ({ playerId: 1, fullName: 'LeBron James', seasons: [], ...overrides }) as Player;

const makeSeason = (overrides: Partial<Season> = {}): Season =>
  ({
    playerId: 1,
    seasonId: '2020-21',
    teamAbbreviation: 'LAL',
    seasonType: 'Regular Season' as const,
    teamId: 1610612747,
    ...overrides,
  }) as Season;

const mockActor = {
  subscribe: vi.fn(),
  stop: vi.fn(),
  send: vi.fn(),
  getSnapshot: vi.fn(),
};

const mockServer = {} as any;

describe('CareerPath', () => {
  let service: CareerPathService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CareerPathService,
        {
          provide: getRepositoryToken(Player),
          useValue: mockPlayerRepository,
        },
        {
          provide: PlayerService,
          useValue: mockPlayerService,
        },
      ],
    }).compile();

    service = module.get<CareerPathService>(CareerPathService);
    mockActor.subscribe.mockReturnValue({ unsubscribe: vi.fn() });
    vi.mocked(createCareerPathMachine).mockReturnValue(mockActor as any);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateRound', () => {
    it('should return empty validAnswers when no random player is found', async () => {
      mockPlayerService.findRandomPlayer.mockResolvedValue(null);

      const result = await service['generateRound'](mockDifficulty);

      expect(result).toEqual({ validAnswers: [] });
      expect(mockPlayerRepository.findOne).not.toHaveBeenCalled();
    });

    it('should return empty validAnswers when player cannot be loaded from DB', async () => {
      mockPlayerService.findRandomPlayer.mockResolvedValue(makePlayer());
      mockPlayerRepository.findOne.mockResolvedValue(null);

      const result = await service['generateRound'](mockDifficulty);

      expect(result).toEqual({ validAnswers: [] });
      expect(mockPlayerRepository.query).not.toHaveBeenCalled();
    });

    it('should return only the player when their career signature is empty', async () => {
      const player = makePlayer({
        seasons: [
          makeSeason({ teamId: null, teamAbbreviation: 'TOT' }),
          makeSeason({ seasonType: 'Playoffs', teamId: 1610612747 }),
        ],
      });
      mockPlayerService.findRandomPlayer.mockResolvedValue(player);
      mockPlayerRepository.findOne.mockResolvedValue(player);

      const result = await service['generateRound'](mockDifficulty);

      expect(result).toEqual({ validAnswers: [player] });
      expect(mockPlayerRepository.query).not.toHaveBeenCalled();
    });

    it('should fall back to the original player when the signature query returns no rows', async () => {
      const player = makePlayer({ seasons: [makeSeason()] });
      mockPlayerService.findRandomPlayer.mockResolvedValue(player);
      mockPlayerRepository.findOne.mockResolvedValue(player);
      mockPlayerRepository.query.mockResolvedValue([]);

      const result = await service['generateRound'](mockDifficulty);

      expect(result).toEqual({ validAnswers: [player] });
      expect(mockPlayerRepository.findBy).not.toHaveBeenCalled();
    });

    it('should return all players whose IDs are returned by the signature query', async () => {
      const player1 = makePlayer({ playerId: 1 });
      const player2 = makePlayer({ playerId: 2, fullName: 'Dwyane Wade' });
      const player = makePlayer({ playerId: 1, seasons: [makeSeason()] });

      mockPlayerService.findRandomPlayer.mockResolvedValue(player);
      mockPlayerRepository.findOne.mockResolvedValue(player);
      mockPlayerRepository.query.mockResolvedValue([
        { player_id: 1 },
        { player_id: 2 },
      ]);
      mockPlayerRepository.findBy.mockResolvedValue([player1, player2]);

      const result = await service['generateRound'](mockDifficulty);

      expect(result).toEqual({ validAnswers: [player1, player2] });
      expect(mockPlayerRepository.findBy).toHaveBeenCalledWith({
        playerId: expect.anything(),
      });
    });

    it('should pass the consecutively-deduplicated team signature to the query', async () => {
      const LAL = 1610612747;
      const BOS = 1610612738;
      const seasons = [
        makeSeason({ seasonId: '2019-20', teamId: LAL, teamAbbreviation: 'LAL' }),
        makeSeason({ seasonId: '2020-21', teamId: LAL, teamAbbreviation: 'LAL' }),
        makeSeason({ seasonId: '2021-22', teamId: BOS, teamAbbreviation: 'BOS' }),
      ];
      const player = makePlayer({ seasons });

      mockPlayerService.findRandomPlayer.mockResolvedValue(player);
      mockPlayerRepository.findOne.mockResolvedValue(player);
      mockPlayerRepository.query.mockResolvedValue([{ player_id: 1 }]);
      mockPlayerRepository.findBy.mockResolvedValue([player]);

      await service['generateRound'](mockDifficulty);

      // Consecutive LAL seasons are collapsed to one entry: [LAL, BOS]
      expect(mockPlayerRepository.query).toHaveBeenCalledWith(
        expect.any(String),
        [[LAL, BOS]],
      );
    });
  });

  describe('createRoom', () => {
    it('should call createCareerPathMachine, subscribe to the actor, and return a room id', () => {
      const roomId = service.createRoom(mockServer);

      expect(typeof roomId).toBe('string');
      expect(roomId.length).toBe(5);
      expect(vi.mocked(createCareerPathMachine)).toHaveBeenCalledWith(
        { io: mockServer, roomId },
        expect.any(Function),
      );
      expect(mockActor.subscribe).toHaveBeenCalledTimes(1);
    });

    it('should remove the room when the actor reaches a done status', () => {
      const roomId = service.createRoom(mockServer);

      const [[subscriberFn]] = mockActor.subscribe.mock.calls;
      subscriberFn({ status: 'done' });

      expect(mockActor.stop).toHaveBeenCalled();
      expect(service.getRoom(roomId)).toBeUndefined();
    });

    it('should not remove the room when the actor status is not done', () => {
      const roomId = service.createRoom(mockServer);

      const [[subscriberFn]] = mockActor.subscribe.mock.calls;
      subscriberFn({ status: 'active' });

      expect(mockActor.stop).not.toHaveBeenCalled();
      expect(service.getRoom(roomId)).toBe(mockActor);
    });
  });

  describe('getRoom', () => {
    it('should return undefined for a room that does not exist', () => {
      expect(service.getRoom('NOPE1')).toBeUndefined();
    });

    it('should return the actor for a room that was created', () => {
      const roomId = service.createRoom(mockServer);
      expect(service.getRoom(roomId)).toBe(mockActor);
    });
  });
});
