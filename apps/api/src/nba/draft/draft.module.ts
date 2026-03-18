import { FranchisePoolGenerator } from '@/nba/pool/generators/franchise.generator';
import { MvpPoolGenerator } from '@/nba/pool/generators/mvp.generator';
import { PoolController } from '@/nba/pool/pool.controller';
import { PoolService } from '@/nba/pool/pool.service';
import { SavedPool, Season } from '@dribblio/types';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DraftGateway } from './draft.gateway';
import { DraftService } from './draft.service';

@Module({
  imports: [TypeOrmModule.forFeature([Season, SavedPool])],
  providers: [DraftService, DraftGateway, MvpPoolGenerator, FranchisePoolGenerator, PoolService],
  controllers: [PoolController],
})
export class DraftModule {}
