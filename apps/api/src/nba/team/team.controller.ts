import { TeamService } from '@/nba/team/team.service';
import { Team } from '@dribblio/types';
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  findAll(): Promise<Team[]> {
    return this.teamService.findAll();
  }

  @Get(':team_id')
  findOne(
    @Param('team_id', ParseIntPipe) teamId: number,
  ): Promise<Team | null> {
    return this.teamService.findOne(teamId);
  }
}
