import { PlayerService } from '@/nba/player/player.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PlayerController } from './player.controller';

describe('PlayerController', () => {
  let controller: PlayerController;
  let service: PlayerService;

  const mockPlayerService = {
    findAll: vi.fn(),
    findOne: vi.fn(),
    findActive: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerController],
      providers: [
        {
          provide: PlayerService,
          useValue: mockPlayerService,
        },
      ],
    }).compile();

    controller = module.get<PlayerController>(PlayerController);
    service = module.get(PlayerService);

    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should delegate to service.findAll and return the result', async () => {
      const players = [{ playerId: 1 }, { playerId: 2 }];
      mockPlayerService.findAll.mockResolvedValue(players);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalledWith();
      expect(result).toBe(players);
    });
  });

  describe('findActive', () => {
    it('should delegate to service.findActive and return the result', async () => {
      const activePlayers = [{ playerId: 1, isActive: true }];
      mockPlayerService.findActive.mockResolvedValue(activePlayers);

      const result = await controller.findActive();

      expect(service.findActive).toHaveBeenCalledWith();
      expect(result).toBe(activePlayers);
    });
  });

  describe('findOne', () => {
    it('should delegate to service.findOne with the playerId and return the result', async () => {
      const player = { playerId: 42, firstName: 'LeBron' };
      mockPlayerService.findOne.mockResolvedValue(player);

      const result = await controller.findOne(42);

      expect(service.findOne).toHaveBeenCalledWith(42);
      expect(result).toBe(player);
    });
  });
});
