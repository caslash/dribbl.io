import { CareerPathGateway } from '@/nba/careerpath/careerpath.gateway';
import { CareerPathService } from '@/nba/careerpath/careerpath.service';
import { PlayerService } from '@/nba/player/player.service';
import { Player } from '@dribblio/types';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Player])],
  providers: [CareerPathService, PlayerService, CareerPathGateway],
  controllers: [],
})
export class CareerpathModule {}
