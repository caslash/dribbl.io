import { PlayersController } from '@/nba/player/player.controller';
import { PlayersService } from '@/nba/player/player.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [PlayersController],
  providers: [PlayersService],
  exports: [PlayersService],
})
export class PlayersModule {}
