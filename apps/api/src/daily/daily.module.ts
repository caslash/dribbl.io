import { Module } from '@nestjs/common';
import { RosterModule } from '@/daily/roster/roster.module';

/**
 * Root module for all daily challenge game types.
 *
 * Each game type (e.g. roster) owns its own sub-module. Adding a new daily
 * game type means creating a new sub-module and importing it here.
 */
@Module({
  imports: [RosterModule],
})
export class DailyModule {}
