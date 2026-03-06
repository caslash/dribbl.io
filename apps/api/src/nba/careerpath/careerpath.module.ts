import { CareerPathService } from '@/nba/careerpath/careerpath.service';
import { PlayerService } from '@/nba/player/player.service';
import { Player } from '@dribblio/types';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Player]), PlayerService],
  providers: [CareerPathService],
  controllers: [],
})
export class CareerpathModule {}
