import { MvpPoolGenerator } from '@/nba/draft/pool/generators/mvp.generator';
import { PoolService } from '@/nba/draft/pool/pool.service';
import { NotFoundException } from '@nestjs/common';
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

    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMvpPool', () => {
    it('should call mvpGenerator.generate and return the entries', async () => {
      const entries = [{ id: 'e1', available: true }];
      mockGenerator.generate.mockResolvedValue(entries);

      const result = await controller.getMvpPool();

      expect(generator.generate).toHaveBeenCalled();
      expect(result).toBe(entries);
    });
  });

  describe('preview', () => {
    it('should call poolService.createPool with the dto and return the saved pool', async () => {
      const dto = { name: 'Test', draftMode: 'mvp' as const, visibility: 'private' as const, entries: [] };
      const savedPool = { id: 'pool-1', ...dto };
      mockPoolService.createPool.mockResolvedValue(savedPool);

      const result = await controller.preview(dto);

      expect(service.createPool).toHaveBeenCalledWith(dto);
      expect(result).toBe(savedPool);
    });
  });

  describe('listPublic', () => {
    it('should call poolService.listPublicPools and return the pools', async () => {
      const pools = [{ id: 'p1' }, { id: 'p2' }];
      mockPoolService.listPublicPools.mockResolvedValue(pools);

      const result = await controller.listPublic();

      expect(service.listPublicPools).toHaveBeenCalledWith();
      expect(result).toBe(pools);
    });
  });

  describe('findOne', () => {
    it('should return the pool when it is found', async () => {
      const pool = { id: 'pool-1', name: 'Pool' };
      mockPoolService.loadPool.mockResolvedValue(pool);

      const result = await controller.findOne('pool-1');

      expect(service.loadPool).toHaveBeenCalledWith('pool-1');
      expect(result).toBe(pool);
    });

    it('should throw NotFoundException when pool is not found', async () => {
      mockPoolService.loadPool.mockResolvedValue(null);

      await expect(controller.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should return the updated pool when it is found', async () => {
      const updatedPool = { id: 'pool-1', name: 'Updated' };
      mockPoolService.updatePool.mockResolvedValue(updatedPool);

      const result = await controller.update('pool-1', { name: 'Updated' });

      expect(service.updatePool).toHaveBeenCalledWith('pool-1', { name: 'Updated' });
      expect(result).toBe(updatedPool);
    });

    it('should throw NotFoundException when pool is not found', async () => {
      mockPoolService.updatePool.mockResolvedValue(null);

      await expect(controller.update('nonexistent', { name: 'X' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should resolve without throwing when pool is deleted', async () => {
      mockPoolService.deletePool.mockResolvedValue(true);

      await expect(controller.remove('pool-1')).resolves.toBeUndefined();
      expect(service.deletePool).toHaveBeenCalledWith('pool-1');
    });

    it('should throw NotFoundException when pool is not found', async () => {
      mockPoolService.deletePool.mockResolvedValue(false);

      await expect(controller.remove('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });
});
