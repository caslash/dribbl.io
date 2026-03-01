import { Accolade, Player, Season, Team } from '@dribblio/types';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerController } from './player/player.controller';
import { PlayerService } from './player/player.service';
import { TeamController } from './team/team.controller';
import { TeamService } from './team/team.service';
import { DraftModule } from './draft/draft.module';

@Module({
  imports: [TypeOrmModule.forFeature([Player, Season, Accolade, Team]), DraftModule],
  controllers: [PlayerController, TeamController],
  providers: [PlayerService, TeamService],
})
export class NbaModule {}
