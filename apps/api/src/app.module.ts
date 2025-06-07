import { AuthModule } from '@/auth/auth.module';
import { NBAModule } from '@/nba/nba.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [NBAModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
