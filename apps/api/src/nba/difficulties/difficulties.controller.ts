import { GameDifficulties } from '@dribblio/types';
import { Controller, Get } from '@nestjs/common';

@Controller('difficulties')
export class DifficultiesController {
  @Get()
  findAll() {
    return GameDifficulties.allModes;
  }
}
