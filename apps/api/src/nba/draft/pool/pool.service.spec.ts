import { MvpPoolGenerator } from '@/nba/draft/pool/generators/mvp.generator';
import { SavedPool } from '@dribblio/types';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PoolService } from './pool.service';

describe('PoolService', () => {
  let service: PoolService;
  let generator: MvpPoolGenerator;

  const mockMvpGenerator = {
    generate: vi.fn(),
  };

  const mockSavedPoolRepository = {
    save: vi.fn(),
    findOneBy: vi.fn(),
    findBy: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PoolService,
        { provide: MvpPoolGenerator, useValue: mockMvpGenerator },
        {
          provide: getRepositoryToken(SavedPool),
          useValue: mockSavedPoolRepository,
        },
      ],
    }).compile();

    service = module.get<PoolService>(PoolService);
    generator = module.get(MvpPoolGenerator);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
