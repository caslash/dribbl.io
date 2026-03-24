import { CareerpathModule } from './careerpath/careerpath.module';
import { DailyModule } from './daily/daily.module';
import { DraftModule } from './draft/draft.module';
import { PlayerModule } from './player/player.module';
import { PoolModule } from './pool/pool.module';
import { Team } from '@dribblio/types';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamController } from './team/team.controller';
import { TeamService } from './team/team.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Team]),
    DraftModule,
    CareerpathModule,
    PlayerModule,
    PoolModule,
    DailyModule,
  ],
  controllers: [TeamController],
  providers: [TeamService],
})
export class NbaModule {}
