import { MvpPoolGenerator } from '@/nba/draft/pool/generators/mvp.generator';
import { PoolService } from '@/nba/draft/pool/pool.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PoolController } from './pool.controller';

describe('PoolController', () => {
  let controller: PoolController;
  let service: PoolService;
  let generator: MvpPoolGenerator;

  const mockPoolService = {
    generatePreview: vi.fn(),
    finalize: vi.fn(),
    createPool: vi.fn(),
    savePool: vi.fn(),
    loadPool: vi.fn(),
    listPublicPools: vi.fn(),
    updatePool: vi.fn(),
    deletePool: vi.fn(),
  };

  const mockGenerator = {
    generate: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PoolController],
      providers: [
        {
          provide: PoolService,
          useValue: mockPoolService,
        },
        {
          provide: MvpPoolGenerator,
          useValue: mockGenerator,
        },
      ],
    }).compile();

    controller = module.get<PoolController>(PoolController);
    service = module.get(PoolService);
    generator = module.get(MvpPoolGenerator);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
