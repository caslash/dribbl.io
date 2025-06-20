import { DatabaseModule } from '@/database/database.module';
import { CareerPathGateway } from '@/nba/games/careerpath/careerpath.gateway';
import { GameService } from '@/nba/games/careerpath/game.service';
import { RoomFactory } from '@/nba/games/careerpath/room/factory.service';
import { RoomService } from '@/nba/games/careerpath/room/room.service';
import { PlayersModule } from '@/nba/player/player.module';
import { UsersModule } from '@/users/users.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [PlayersModule, DatabaseModule, UsersModule],
  controllers: [],
  providers: [CareerPathGateway, RoomService, RoomFactory, GameService],
})
export class NBAModule {}
