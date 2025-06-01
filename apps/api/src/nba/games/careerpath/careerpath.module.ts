import { Module } from '@nestjs/common';
import { CareerPathGateway } from './careerpath.gateway';
import { PlayersModule } from 'src/nba/player/player.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [PlayersModule, DatabaseModule],
  providers: [CareerPathGateway],
})
export class CareerPathModule {}
