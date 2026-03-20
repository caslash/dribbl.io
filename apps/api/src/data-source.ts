import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { SavedPool } from '@dribblio/types';

dotenv.config();

/**
 * Standalone TypeORM DataSource for the CLI migration tooling.
 *
 * Only includes `SavedPool` — the single entity the API owns.
 * Including pipeline-managed entities (Player, Team, Season, Accolade)
 * would cause TypeORM to generate migrations for tables it does not own.
 *
 * @example
 * // Run via npm scripts:
 * // npm run migration:run -w api
 */
export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [SavedPool],
  migrations: ['src/migrations/*.ts'],
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
});
