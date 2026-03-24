import { PlayerController } from '@/nba/player/player.controller';
import { PlayerService } from '@/nba/player/player.service';
import { Player } from '@dribblio/types';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Player])],
  providers: [PlayerService],
  controllers: [PlayerController],
  exports: [PlayerService],
})
export class PlayerModule {}
