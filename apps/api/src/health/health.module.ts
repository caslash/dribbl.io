import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';

/**
 * Registers the liveness probe endpoint at `GET /api/health`.
 */
@Module({
  controllers: [HealthController],
})
export class HealthModule {}
