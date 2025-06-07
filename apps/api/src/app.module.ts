import { Module } from '@nestjs/common';
import { NBAModule } from './nba/nba.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [NBAModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
