import { MvpPoolGenerator } from '@/nba/draft/pool/generators/mvp.generator';
import { SavedPool, Season } from '@dribblio/types';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DraftGateway } from './draft.gateway';
import { DraftService } from './draft.service';
import { PoolController } from './pool/pool.controller';
import { PoolService } from './pool/pool.service';

@Module({
  imports: [TypeOrmModule.forFeature([Season, SavedPool])],
  providers: [DraftService, DraftGateway, MvpPoolGenerator, PoolService],
  controllers: [PoolController],
})
export class DraftModule {}
