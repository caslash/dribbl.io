import { AwardsService } from '@/api/awards/api.awards.service';
import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('awards')
export class AwardsController {
  constructor(private readonly awardsService: AwardsService) {}

  @Get()
  async getAwards(@Res() response: Response) {
    const awards = await this.awardsService.awards();
    response.status(HttpStatus.OK).json({ count: awards.length, awards });
  }
}
