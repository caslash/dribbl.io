import { Module } from '@nestjs/common';
import { PlayersModule } from './player/player.module';
import { DatabaseModule } from '../database/database.module';
import { CareerPathGateway } from './games/careerpath/careerpath.gateway';
import { RoomService } from './games/careerpath/room/room.service';
import { GameService } from './games/careerpath/game.service';
import { RoomFactory } from './games/careerpath/room/factory.service';

@Module({
  imports: [PlayersModule, DatabaseModule],
  controllers: [],
  providers: [CareerPathGateway, RoomService, RoomFactory, GameService],
})
export class NBAModule {}
