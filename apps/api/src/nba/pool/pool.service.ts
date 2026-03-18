import { PoolGenerator } from '@/nba/pool/generator.interface';
import { FranchisePoolGenerator } from '@/nba/pool/generators/franchise.generator';
import { MvpPoolGenerator } from '@/nba/pool/generators/mvp.generator';
import {
  CreatePoolDto,
  DraftRoomConfig,
  PoolEntry,
  SavedPool,
  UpdatePoolDto,
} from '@dribblio/types';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PoolService {
  private get generators(): Record<string, PoolGenerator> {
    return { mvp: this.mvpGenerator, franchise: this.franchiseGenerator };
  }

  constructor(
    private readonly mvpGenerator: MvpPoolGenerator,
    private readonly franchiseGenerator: FranchisePoolGenerator,
    @InjectRepository(SavedPool)
    private readonly savedPoolRepository: Repository<SavedPool>,
  ) {}

  async generatePreview(config: DraftRoomConfig): Promise<PoolEntry[]> {
    const generator = this.generators[config.draftMode];
    if (!generator)
      throw new InternalServerErrorException(
        `Generator for ${config.draftMode} does not exist.`,
      );
    return generator.generate();
  }

  async finalize(
    config: DraftRoomConfig,
    overrides?: PoolEntry[],
  ): Promise<PoolEntry[]> {
    if (overrides) return overrides;
    return this.generatePreview(config);
  }

  async createPool(dto: CreatePoolDto): Promise<SavedPool> {
    return this.savedPoolRepository.save({
      name: dto.name,
      visibility: dto.visibility,
      draftMode: dto.draftMode,
      entries: dto.entries,
      createdBy: null,
    });
  }

  async savePool(
    name: string,
    visibility: 'public' | 'private',
    config: DraftRoomConfig,
    entries: PoolEntry[],
  ): Promise<SavedPool> {
    return this.savedPoolRepository.save({
      name,
      draftMode: config.draftMode,
      visibility,
      entries,
      createdBy: null,
    });
  }

  async loadPool(poolId: string): Promise<SavedPool | null> {
    return this.savedPoolRepository.findOneBy({ id: poolId });
  }

  async listPublicPools(): Promise<SavedPool[]> {
    return this.savedPoolRepository.findBy({ visibility: 'public' });
  }

  async updatePool(
    poolId: string,
    dto: UpdatePoolDto,
  ): Promise<SavedPool | null> {
    const pool = await this.savedPoolRepository.findOneBy({ id: poolId });
    if (!pool) return null;
    Object.assign(pool, dto);
    return this.savedPoolRepository.save(pool);
  }

  async deletePool(poolId: string): Promise<boolean> {
    const result = await this.savedPoolRepository.delete(poolId);
    if (result.affected === undefined || result.affected === null)
      throw new NotFoundException();

    return result.affected > 0;
  }
}
