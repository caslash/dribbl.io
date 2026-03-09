import { MvpPoolGenerator } from '@/nba/pool/generators/mvp.generator';
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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generatePreview', () => {
    it('should call the mvp generator for mvp draftMode and return entries', async () => {
      const entries = [{ id: 'entry-1', available: true }];
      mockMvpGenerator.generate.mockResolvedValue(entries);
      const config = {
        draftMode: 'mvp',
        draftOrder: 'snake',
        maxRounds: 3,
        turnDuration: 60,
      } as any;

      const result = await service.generatePreview(config);

      expect(generator.generate).toHaveBeenCalledWith(config);
      expect(result).toBe(entries);
    });
  });

  describe('finalize', () => {
    it('should return overrides directly without calling the generator', async () => {
      const overrides = [{ id: 'override-1', available: true }] as any;
      const config = {
        draftMode: 'mvp',
        draftOrder: 'snake',
        maxRounds: 3,
        turnDuration: 60,
      } as any;

      const result = await service.finalize(config, overrides);

      expect(result).toBe(overrides);
      expect(mockMvpGenerator.generate).not.toHaveBeenCalled();
    });

    it('should call generatePreview when no overrides are provided', async () => {
      const entries = [{ id: 'entry-1', available: true }] as any;
      mockMvpGenerator.generate.mockResolvedValue(entries);
      const config = {
        draftMode: 'mvp',
        draftOrder: 'snake',
        maxRounds: 3,
        turnDuration: 60,
      } as any;

      const result = await service.finalize(config);

      expect(mockMvpGenerator.generate).toHaveBeenCalledWith(config);
      expect(result).toBe(entries);
    });
  });

  describe('createPool', () => {
    it('should save the pool with the correct fields and return the saved entity', async () => {
      const savedPool = { id: 'uuid-1', name: 'My Pool' };
      mockSavedPoolRepository.save.mockResolvedValue(savedPool);

      const dto = {
        name: 'My Pool',
        visibility: 'public' as const,
        draftMode: 'mvp' as const,
        entries: [{ id: 'e1' }] as any,
      };

      const result = await service.createPool(dto);

      expect(mockSavedPoolRepository.save).toHaveBeenCalledWith({
        name: 'My Pool',
        visibility: 'public',
        draftMode: 'mvp',
        entries: dto.entries,
        createdBy: null,
      });
      expect(result).toBe(savedPool);
    });
  });

  describe('savePool', () => {
    it('should save the pool with the correct fields derived from config and return the entity', async () => {
      const savedPool = { id: 'uuid-2', name: 'Draft Pool' };
      mockSavedPoolRepository.save.mockResolvedValue(savedPool);

      const config = {
        draftMode: 'mvp',
        draftOrder: 'snake',
        maxRounds: 3,
        turnDuration: 60,
      } as any;
      const entries = [{ id: 'e1' }] as any;

      const result = await service.savePool(
        'Draft Pool',
        'private',
        config,
        entries,
      );

      expect(mockSavedPoolRepository.save).toHaveBeenCalledWith({
        name: 'Draft Pool',
        draftMode: 'mvp',
        visibility: 'private',
        entries,
        createdBy: null,
      });
      expect(result).toBe(savedPool);
    });
  });

  describe('loadPool', () => {
    it('should call findOneBy with the pool id and return the pool', async () => {
      const pool = { id: 'pool-1', name: 'Pool' };
      mockSavedPoolRepository.findOneBy.mockResolvedValue(pool);

      const result = await service.loadPool('pool-1');

      expect(mockSavedPoolRepository.findOneBy).toHaveBeenCalledWith({
        id: 'pool-1',
      });
      expect(result).toBe(pool);
    });

    it('should return null when pool is not found', async () => {
      mockSavedPoolRepository.findOneBy.mockResolvedValue(null);

      const result = await service.loadPool('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('listPublicPools', () => {
    it('should call findBy with public visibility and return the list', async () => {
      const pools = [{ id: 'p1' }, { id: 'p2' }];
      mockSavedPoolRepository.findBy.mockResolvedValue(pools);

      const result = await service.listPublicPools();

      expect(mockSavedPoolRepository.findBy).toHaveBeenCalledWith({
        visibility: 'public',
      });
      expect(result).toBe(pools);
    });
  });

  describe('updatePool', () => {
    it('should find the pool, merge the dto, save it, and return the updated pool', async () => {
      const existingPool = {
        id: 'pool-1',
        name: 'Old Name',
        visibility: 'private',
      };
      const updatedPool = {
        id: 'pool-1',
        name: 'New Name',
        visibility: 'public',
      };
      mockSavedPoolRepository.findOneBy.mockResolvedValue(existingPool);
      mockSavedPoolRepository.save.mockResolvedValue(updatedPool);

      const dto = { name: 'New Name', visibility: 'public' as const };
      const result = await service.updatePool('pool-1', dto);

      expect(mockSavedPoolRepository.findOneBy).toHaveBeenCalledWith({
        id: 'pool-1',
      });
      expect(mockSavedPoolRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'pool-1',
          name: 'New Name',
          visibility: 'public',
        }),
      );
      expect(result).toBe(updatedPool);
    });

    it('should return null when pool is not found', async () => {
      mockSavedPoolRepository.findOneBy.mockResolvedValue(null);

      const result = await service.updatePool('nonexistent', { name: 'X' });

      expect(mockSavedPoolRepository.save).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('deletePool', () => {
    it('should return true when one or more rows were affected', async () => {
      mockSavedPoolRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.deletePool('pool-1');

      expect(mockSavedPoolRepository.delete).toHaveBeenCalledWith('pool-1');
      expect(result).toBe(true);
    });

    it('should return false when no rows were affected', async () => {
      mockSavedPoolRepository.delete.mockResolvedValue({ affected: 0 });

      const result = await service.deletePool('pool-1');

      expect(result).toBe(false);
    });

    it('should return true when affected is undefined (driver does not report count)', async () => {
      mockSavedPoolRepository.delete.mockResolvedValue({ affected: undefined });

      const result = await service.deletePool('pool-1');

      expect(result).toBe(true);
    });
  });
});
