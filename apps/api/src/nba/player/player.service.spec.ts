import { NBAPrismaService } from '@/database/nba.prisma.service';
import { PlayersService } from '@/nba/player/player.service';
import { Test, TestingModule } from '@nestjs/testing';

const mockPrisma = {
  player: {
    findMany: jest.fn(),
    count: jest.fn(),
    findFirst: jest.fn(),
  },
};

describe('PlayersService', () => {
  let service: PlayersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayersService, { provide: NBAPrismaService, useValue: mockPrisma }],
    }).compile();

    service = module.get<PlayersService>(PlayersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
