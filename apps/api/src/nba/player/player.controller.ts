import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { PlayersService } from './player.service';

@Controller('players')
export class PlayersController {
  constructor(private readonly playerService: PlayersService) {}

  @Get()
  findAll() {
    return this.playerService.findAll();
  }
  
  @Get('random')
  async findRandom(){
    return await this.playerService.findRandom()
  }

  @Get('count')
  async findCount() {
    return await this.playerService.findCount();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.playerService.findOne(+id);
  }
}
