import { PlayerService } from '@/nba/player/player.service';
import { Player } from '@dribblio/types';
import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';

@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get()
  search(@Query('search') searchTerm?: string): Promise<Player[]> {
    if (searchTerm) {
      return this.playerService.search(searchTerm);
    }

    return this.playerService.findAll();
  }

  @Get('active')
  findActive(): Promise<Player[]> {
    return this.playerService.findActive();
  }

  @Get(':player_id')
  findOne(
    @Param('player_id', ParseIntPipe) playerId: number,
  ): Promise<Player | null> {
    return this.playerService.findOne(playerId);
  }
}
