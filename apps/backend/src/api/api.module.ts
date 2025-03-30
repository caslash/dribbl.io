import { AwardsApiModule } from '@/api/awards/api.awards.module';
import { PlayersApiModule } from '@/api/players/api.players.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [PlayersApiModule, AwardsApiModule],
  controllers: [],
  providers: [],
})
export class ApiModule {}
