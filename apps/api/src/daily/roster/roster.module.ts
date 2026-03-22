import { DailyChallenge, Player, Season, Team } from '@dribblio/types';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyScheduleService } from '@/daily/daily-schedule.service';
import { RosterController } from '@/daily/roster/roster.controller';
import { RosterService } from '@/daily/roster/roster.service';

/**
 * Feature module for the Daily Roster Challenge REST API.
 *
 * Registers the TypeORM repositories needed by both `DailyScheduleService`
 * (challenge lookup) and `RosterService` (roster resolution and guess
 * validation).
 */
@Module({
  imports: [TypeOrmModule.forFeature([DailyChallenge, Season, Player, Team])],
  providers: [DailyScheduleService, RosterService],
  controllers: [RosterController],
})
export class RosterModule {}
