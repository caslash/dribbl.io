import { FranchisePoolGenerator } from '@/nba/pool/generators/franchise.generator';
import { MvpPoolGenerator } from '@/nba/pool/generators/mvp.generator';
import { PoolController } from '@/nba/pool/pool.controller';
import { PoolService } from '@/nba/pool/pool.service';
import { SavedPool, Season } from '@dribblio/types';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SavedPool, Season])],
  providers: [PoolService, MvpPoolGenerator, FranchisePoolGenerator],
  controllers: [PoolController],
  exports: [PoolService],
})
export class PoolModule {}
