import { PlayersService } from '@/nba/player/player.service';
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('players')
export class PlayersController {
  constructor(private readonly playerService: PlayersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.playerService.findAll();
  }

  @Get('random')
  async findRandom() {
    return await this.playerService.findRandom();
  }

  @Get('count')
  async findCount() {
    return await this.playerService.findCount();
  }

  @Get('search')
  async search(@Query('searchTerm') searchTerm: string) {
    const results = await this.playerService.findAll({
      orderBy: {
        last_name: 'asc',
      },
      where: {
        display_first_last: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
    });

    return {
      results,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.playerService.findOne(+id);
  }
}
