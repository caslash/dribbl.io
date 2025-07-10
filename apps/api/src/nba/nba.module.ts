import { DatabaseModule } from '@/database/database.module';
import { PlayersModule } from '@/nba/player/player.module';
import { UsersModule } from '@/users/users.module';
import { Module } from '@nestjs/common';
import { CareerPathModule } from './games/careerpath/careerpath.module';

@Module({
  imports: [PlayersModule, DatabaseModule, UsersModule, CareerPathModule],
  controllers: [],
  providers: [],
})
export class NBAModule {}
