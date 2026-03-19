import { Accolade, Player, SavedPool, Season, Team } from '@dribblio/types';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './health/health.module';
import { NbaModule } from './nba/nba.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        entities: [Player, Season, Accolade, Team, SavedPool],
        synchronize: false,
        migrationsRun: false,
        ssl:
          process.env.NODE_ENV === 'production'
            ? { rejectUnauthorized: false }
            : false,
      }),
    }),
    NbaModule,
    HealthModule,
  ],
})
export class AppModule {}
