import { PoolGenerator } from '@/nba/draft/pool/generator.interface';
import { MvpPoolGenerator } from '@/nba/draft/pool/generators/mvp.generator';
import {
  CreatePoolDto,
  PoolEntry,
  RoomConfig,
  SavedPool,
  UpdatePoolDto,
} from '@dribblio/types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PoolService {
  private get generators(): Record<string, PoolGenerator> {
    return { mvp: this.mvpGenerator };
  }

  constructor(
    private readonly mvpGenerator: MvpPoolGenerator,
    @InjectRepository(SavedPool)
    private readonly savedPoolRepository: Repository<SavedPool>,
  ) {}

  async generatePreview(config: RoomConfig): Promise<PoolEntry[]> {
    const generator = this.generators[config.draftMode];
    return generator.generate(config);
  }

  async finalize(
    config: RoomConfig,
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
    config: RoomConfig,
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
    return result.affected ? result.affected > 0 : true;
  }
}
