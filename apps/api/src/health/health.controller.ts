import { Controller, Get } from '@nestjs/common';

/**
 * Exposes a liveness probe endpoint for load balancers and orchestrators.
 *
 * @example
 * // GET /api/health → { status: 'ok' }
 */
@Controller('health')
export class HealthController {
  /**
   * Returns a static `ok` status to confirm the process is running.
   *
   * @returns An object indicating the service is alive.
   */
  @Get()
  check(): { status: string } {
    return { status: 'ok' };
  }
}
