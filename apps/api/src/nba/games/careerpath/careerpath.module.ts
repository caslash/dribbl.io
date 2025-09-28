import { MultiplayerGateway } from '@/nba/games/careerpath/multiplayer.gateway';
import { UsersModule } from '@/users/users.module';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from 'src/database/database.module';
import { PlayersModule } from 'src/nba/player/player.module';
import { GameService } from './game.service';
import { RoomFactory } from './room/factory.service';
import { RoomService } from './room/room.service';
import { SinglePlayerGateway } from './singleplayer.gateway';

@Module({
  imports: [PlayersModule, UsersModule, DatabaseModule, ScheduleModule.forRoot()],
  providers: [SinglePlayerGateway, MultiplayerGateway, RoomService, RoomFactory, GameService],
  exports: [RoomService, RoomFactory, GameService, SinglePlayerGateway, MultiplayerGateway],
})
export class CareerPathModule {}
