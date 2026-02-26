import { PlayerService } from '@/nba/player/player.service';
import { Player } from '@dribblio/database';
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get()
  findAll(): Promise<Player[]> {
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
