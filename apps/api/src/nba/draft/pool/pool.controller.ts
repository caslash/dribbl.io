import { MvpPoolGenerator } from '@/nba/draft/pool/generators/mvp.generator';
import { PoolService } from '@/nba/draft/pool/pool.service';
import {
  CreatePoolDto,
  MvpSeasonEntry,
  SavedPool,
  UpdatePoolDto,
} from '@dribblio/types';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

@Controller('pools')
export class PoolController {
  constructor(
    private readonly mvpGenerator: MvpPoolGenerator,
    private readonly poolService: PoolService,
  ) {}

  @Get('mvp')
  async getMvpPool(): Promise<MvpSeasonEntry[]> {
    return this.mvpGenerator.generate();
  }

  @Post('preview')
  async preview(@Body() dto: CreatePoolDto): Promise<SavedPool> {
    return this.poolService.createPool(dto);
  }
  @Get('public')
  async listPublic(): Promise<SavedPool[]> {
    return this.poolService.listPublicPools();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SavedPool> {
    const pool = await this.poolService.loadPool(id);
    if (!pool) throw new NotFoundException(`Pool ${id} not found`);
    return pool;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePoolDto,
  ): Promise<SavedPool> {
    const pool = await this.poolService.updatePool(id, dto);
    if (!pool) throw new NotFoundException(`Pool ${id} not found`);
    return pool;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    const deleted = await this.poolService.deletePool(id);
    if (!deleted) throw new NotFoundException(`Pool ${id} not found`);
  }
}
