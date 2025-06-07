import { CareerPathGateway } from '@/nba/games/careerpath/careerpath.gateway';
import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { PlayersModule } from 'src/nba/player/player.module';

@Module({
  imports: [PlayersModule, DatabaseModule],
  providers: [CareerPathGateway],
})
export class CareerPathModule {}
