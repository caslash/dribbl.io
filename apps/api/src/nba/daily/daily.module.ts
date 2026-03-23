import { Module } from '@nestjs/common';
import { DailyScheduleGeneratorService } from '@/nba/daily/daily-schedule-generator.service';
import { RosterModule } from '@/nba/daily/roster/roster.module';

/**
 * Root module for all daily challenge game types.
 *
 * Each game type (e.g. roster) owns its own sub-module. Adding a new daily
 * game type means creating a new sub-module and importing it here.
 * `DailyScheduleGeneratorService` is registered here (rather than inside a
 * game-type sub-module) because it generates schedules for all game types.
 */
@Module({
  imports: [RosterModule],
  providers: [DailyScheduleGeneratorService],
})
export class DailyModule {}
