import { MvpPoolGenerator } from '@/nba/pool/generators/mvp.generator';
import { PoolService } from '@/nba/pool/pool.service';
import {
  CreatePoolDto,
  MvpPoolEntry,
  SavedPool,
  UpdatePoolDto,
} from '@dribblio/types';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

@Controller('pools')
export class PoolController {
  private readonly logger = new Logger(PoolController.name);

  constructor(
    private readonly mvpGenerator: MvpPoolGenerator,
    private readonly poolService: PoolService,
  ) {}

  @Get('mvp')
  async getMvpPool(): Promise<MvpPoolEntry[]> {
    return this.mvpGenerator.generate();
  }

  @Post('preview')
  async preview(@Body() dto: CreatePoolDto): Promise<SavedPool> {
    return this.poolService.createPool(dto);
  }

  @Get('public')
  async listPublic(
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ): Promise<SavedPool[]> {
    return this.poolService.listPublicPools(limit, offset);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SavedPool> {
    const pool = await this.poolService.loadPool(id);
    if (!pool) {
      this.logger.warn(`Pool ${id} not found`);
      throw new NotFoundException(`Pool ${id} not found`);
    }
    return pool;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePoolDto,
  ): Promise<SavedPool> {
    const pool = await this.poolService.updatePool(id, dto);
    if (!pool) {
      this.logger.warn(`Pool ${id} not found for update`);
      throw new NotFoundException(`Pool ${id} not found`);
    }
    return pool;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    const deleted = await this.poolService.deletePool(id);
    if (!deleted) {
      this.logger.warn(`Pool ${id} not found for deletion`);
      throw new NotFoundException(`Pool ${id} not found`);
    }
  }
}
