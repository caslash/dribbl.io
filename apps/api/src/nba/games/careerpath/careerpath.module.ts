import { MultiplayerGateway } from '@/nba/games/careerpath/multiplayer.gateway';
import { UsersModule } from '@/users/users.module';
import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { PlayersModule } from 'src/nba/player/player.module';
import { SinglePlayerGateway } from './singleplayer.gateway';
import { RoomService } from './room/room.service';
import { RoomFactory } from './room/factory.service';
import { GameService } from './game.service';

@Module({
  imports: [PlayersModule, UsersModule, DatabaseModule],
  providers: [SinglePlayerGateway, MultiplayerGateway, RoomService, RoomFactory, GameService],
  exports: [RoomService, RoomFactory, GameService, SinglePlayerGateway, MultiplayerGateway],
})
export class CareerPathModule {}
