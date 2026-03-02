import { Player, Team } from '@dribblio/types';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DraftModule } from './draft/draft.module';
import { PlayerController } from './player/player.controller';
import { PlayerService } from './player/player.service';
import { TeamController } from './team/team.controller';
import { TeamService } from './team/team.service';

@Module({
  imports: [TypeOrmModule.forFeature([Player, Team]), DraftModule],
  controllers: [PlayerController, TeamController],
  providers: [PlayerService, TeamService],
})
export class NbaModule {}
