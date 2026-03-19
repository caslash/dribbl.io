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
        host: process.env.PG_HOST,
        port: Number(process.env.PG_PORT),
        username: process.env.PG_NBA_USERNAME,
        password: process.env.PG_NBA_PASSWORD,
        database: process.env.PG_NBA_DATABASE,
        entities: [Player, Season, Accolade, Team, SavedPool],
        synchronize: false,
        migrationsRun: false,
      }),
    }),
    NbaModule,
    HealthModule,
  ],
})
export class AppModule {}
