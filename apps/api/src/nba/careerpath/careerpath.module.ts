import { CareerPathGateway } from '@/nba/careerpath/careerpath.gateway';
import { CareerPathService } from '@/nba/careerpath/careerpath.service';
import { PlayerModule } from '@/nba/player/player.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [PlayerModule],
  providers: [CareerPathService, CareerPathGateway],
  controllers: [],
})
export class CareerpathModule {}
