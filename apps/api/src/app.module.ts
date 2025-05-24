import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PlayersModule } from './player/player.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [PlayersModule, DatabaseModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
