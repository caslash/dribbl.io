import { Player } from '@dribblio/types';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PlayerService } from './player.service';

const mockPlayerRepository = {
  find: vi.fn(),
  findOne: vi.fn(),
};

describe('PlayerService', () => {
  let service: PlayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerService,
        {
          provide: getRepositoryToken(Player),
          useValue: mockPlayerRepository,
        },
      ],
    }).compile();

    service = module.get<PlayerService>(PlayerService);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should call repository.find and return all players', async () => {
      const players = [{ playerId: 1 }, { playerId: 2 }];
      mockPlayerRepository.find.mockResolvedValue(players);

      const result = await service.findAll();

      expect(mockPlayerRepository.find).toHaveBeenCalledWith();
      expect(result).toBe(players);
    });
  });

  describe('findOne', () => {
    it('should call repository.findOne with correct options and return the player', async () => {
      const player = { playerId: 1, firstName: 'LeBron' };
      mockPlayerRepository.findOne.mockResolvedValue(player);

      const result = await service.findOne(1);

      expect(mockPlayerRepository.findOne).toHaveBeenCalledWith({
        where: { playerId: 1 },
        relations: { accolades: true, seasons: true },
      });
      expect(result).toBe(player);
    });

    it('should return null when player is not found', async () => {
      mockPlayerRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('findActive', () => {
    it('should call repository.find with isActive filter and return active players', async () => {
      const activePlayers = [{ playerId: 1, isActive: true }];
      mockPlayerRepository.find.mockResolvedValue(activePlayers);

      const result = await service.findActive();

      expect(mockPlayerRepository.find).toHaveBeenCalledWith({
        where: { isActive: true },
      });
      expect(result).toBe(activePlayers);
    });
  });
});
