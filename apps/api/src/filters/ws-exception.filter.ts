import { ArgumentsHost, Catch, Logger } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

/**
 * Global exception filter for WebSocket gateways.
 *
 * NestJS's default exception handler only covers HTTP contexts. This filter
 * catches any unhandled exception thrown inside a `@SubscribeMessage` handler
 * and emits a structured `ERROR` event to the offending socket rather than
 * silently dropping it.
 *
 * @example
 * // Register globally in main.ts:
 * app.useGlobalFilters(new WsExceptionFilter());
 */
@Catch()
export class WsExceptionFilter extends BaseWsExceptionFilter {
  private readonly logger = new Logger(WsExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    // Only handle WebSocket contexts. If this filter is ever reached from an
    // HTTP context, defer to Nest's default handling instead of logging a
    // spurious "socket undefined" error and emitting to a non-existent socket.
    if (host.getType() !== 'ws') {
      super.catch(exception, host);
      return;
    }

    const socket = host.switchToWs().getClient<Socket>();

    const message =
      exception instanceof WsException
        ? String(exception.getError())
        : exception instanceof Error
          ? exception.message
          : 'An unexpected error occurred';

    this.logger.error(
      `Unhandled WebSocket exception on socket ${socket.id}: ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    socket.emit('ERROR', { message });
  }
}
