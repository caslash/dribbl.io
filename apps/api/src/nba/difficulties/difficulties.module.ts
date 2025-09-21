import { DifficultiesController } from '@/nba/difficulties/difficulties.controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [DifficultiesController],
})
export class DifficultiesModule {}
