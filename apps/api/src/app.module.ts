import { Module } from '@nestjs/common';
import { NBAModule } from './nba/nba.module';

@Module({
  imports: [NBAModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
