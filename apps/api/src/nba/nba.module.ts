import { Module } from '@nestjs/common';
import { PlayersModule } from './player/player.module';
import { DatabaseModule } from '../database/database.module';
import { CareerPathGateway } from './games/careerpath/careerpath.gateway';

@Module({
  imports: [PlayersModule, DatabaseModule],
  controllers: [],
  providers: [CareerPathGateway],
})
export class NBAModule {}
