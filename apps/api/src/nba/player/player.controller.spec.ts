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
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
