import { DatabaseModule } from '@/database/database.module';
import { PlayersModule } from '@/nba/player/player.module';
import { UsersModule } from '@/users/users.module';
import { Module } from '@nestjs/common';
import { CareerPathModule } from './games/careerpath/careerpath.module';
import { DifficultiesModule } from './difficulties/difficulties.module';

@Module({
  imports: [PlayersModule, DatabaseModule, UsersModule, CareerPathModule, DifficultiesModule],
  controllers: [],
  providers: [],
})
export class NBAModule {}
