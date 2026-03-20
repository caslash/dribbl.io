import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { DataSource } from 'typeorm';

/**
 * Exposes a readiness probe endpoint that verifies both process liveness
 * and database reachability.
 *
 * @example
 * // GET /api/health → { status: 'ok' }
 * // GET /api/health → 503 Service Unavailable (when DB is unreachable)
 */
@Controller('health')
export class HealthController {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * Runs a lightweight DB ping and returns `ok` when the connection is healthy.
   * Throws a 503 if the database cannot be reached, allowing load balancers
   * to route traffic away from an unhealthy instance.
   *
   * @returns An object indicating the service and database are reachable.
   * @throws {ServiceUnavailableException} When the database query fails.
   */
  @Get()
  async check(): Promise<{ status: string }> {
    try {
      await this.dataSource.query('SELECT 1');
      return { status: 'ok' };
    } catch {
      throw new ServiceUnavailableException('Database unreachable');
    }
  }
}
