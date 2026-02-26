import { Accolade, Player, Season, Team } from '@dribblio/database';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerController } from './player/player.controller';
import { PlayerService } from './player/player.service';

@Module({
  imports: [TypeOrmModule.forFeature([Player, Season, Accolade, Team])],
  controllers: [PlayerController],
  providers: [PlayerService],
})
export class NbaModule {}
