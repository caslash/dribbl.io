import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import * as express from 'express';
import { AppModule } from './app.module';
import { WsExceptionFilter } from './filters/ws-exception.filter';

dotenv.config();

const REQUIRED_ENV_VARS = ['DATABASE_URL'] as const;

const logger = new Logger('Bootstrap');

/**
 * Validates that all required environment variables are present.
 * Logs each missing variable name and exits the process if any are absent.
 */
function validateEnv(): void {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    for (const key of missing) {
      logger.error(`Missing required environment variable: ${key}`);
    }
    process.exit(1);
  }
}

async function bootstrap() {
  validateEnv();

  if (!process.env.CORS_ORIGIN && process.env.NODE_ENV === 'production') {
    logger.warn(
      'CORS_ORIGIN is not set in production — requests may be blocked',
    );
  }

  const app = await NestFactory.create(AppModule);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.useGlobalFilters(new WsExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('/api');

  app.enableCors({
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
      : 'http://localhost:3000',
  });

  app.enableShutdownHooks();

  await app.listen(process.env.PORT ?? 3001);
  logger.log(`Application listening on port ${process.env.PORT ?? 3001}`);

  process.on('SIGTERM', async () => {
    await app.close();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    await app.close();
    process.exit(0);
  });
}

bootstrap();
