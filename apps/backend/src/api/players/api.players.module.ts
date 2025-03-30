import { PlayersController } from '@/api/players/api.players.controller';
import { PlayersService } from '@/api/players/api.players.service';
import { DatabaseModule } from '@/database/database.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule],
  controllers: [PlayersController],
  providers: [PlayersService],
})
export class PlayersApiModule {}
