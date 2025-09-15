import { AuthModule } from '@/auth/auth.module';
import { AWSModule } from '@/aws/aws.module';
import { NBAModule } from '@/nba/nba.module';
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';

@Module({
  imports: [NBAModule, AuthModule, UsersModule, AWSModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
