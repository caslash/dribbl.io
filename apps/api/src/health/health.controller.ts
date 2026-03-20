import { Controller, Get } from '@nestjs/common';

/**
 * Exposes a liveness probe endpoint confirming the process is running.
 *
 * @example
 * // GET /api/health → { status: 'ok' }
 */
@Controller('health')
export class HealthController {
  /**
   * Returns `ok` to confirm the process is alive.
   *
   * @returns An object indicating the service is running.
   */
  @Get()
  check(): { status: string } {
    return { status: 'ok' };
  }
}
