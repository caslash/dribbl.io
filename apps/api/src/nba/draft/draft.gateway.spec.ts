import { DraftService } from '@/nba/draft/draft.service';
import { PoolService } from '@/nba/draft/pool/pool.service';
import { Test, TestingModule } from '@nestjs/testing';
import { DraftGateway } from './draft.gateway';

describe('DraftGateway', () => {
  let gateway: DraftGateway;

  const mockDraftService = {
    createRoom: vi.fn(),
    getRoom: vi.fn(),
    computeTurnOrder: vi.fn(),
  };

  const mockPoolService = {
    loadPool: vi.fn(),
    finalize: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DraftGateway,
        { provide: DraftService, useValue: mockDraftService },
        { provide: PoolService, useValue: mockPoolService },
      ],
    }).compile();

    gateway = module.get<DraftGateway>(DraftGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
