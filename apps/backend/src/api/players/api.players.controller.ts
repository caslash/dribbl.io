import { PlayersService } from '@/api/players/api.players.service';
import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  async getAll(@Res() response: Response) {
    response.status(HttpStatus.OK).json(await this.playersService.all());
  }

  @Post()
  async getWhere(
    @Body() where: Prisma.PlayerWhereInput,
    @Res() response: Response,
  ) {
    response
      .status(HttpStatus.OK)
      .json(await this.playersService.players({ where }));
  }

  @Get('random')
  async getRandom(@Res() response: Response) {
    response.status(HttpStatus.OK).json(await this.playersService.random({}));
  }

  @Get('count')
  async getCount(@Res() response: Response) {
    response.status(HttpStatus.OK).json(await this.playersService.count({}));
  }
}
