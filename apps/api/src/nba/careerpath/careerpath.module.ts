import { CareerPathGateway } from '@/nba/careerpath/careerpath.gateway';
import { CareerPathService } from '@/nba/careerpath/careerpath.service';
import { PlayerModule } from '@/nba/player/player.module';
import { Player } from '@dribblio/types';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Player]), PlayerModule],
  providers: [CareerPathService, CareerPathGateway],
  controllers: [],
})
export class CareerpathModule {}
