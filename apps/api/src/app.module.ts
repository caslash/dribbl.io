import { AuthModule } from '@/auth/auth.module';
import { NBAModule } from '@/nba/nba.module';
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';

@Module({
  imports: [NBAModule, AuthModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
