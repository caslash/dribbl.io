import { Player, Team } from '@dribblio/types';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DraftModule } from './draft/draft.module';
import { PlayerController } from './player/player.controller';
import { PlayerService } from './player/player.service';
import { TeamController } from './team/team.controller';
import { TeamService } from './team/team.service';
import { CareerpathModule } from './careerpath/careerpath.module';

@Module({
  imports: [TypeOrmModule.forFeature([Player, Team]), DraftModule, CareerpathModule],
  controllers: [PlayerController, TeamController],
  providers: [PlayerService, TeamService],
})
export class NbaModule {}
