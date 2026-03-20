import { Socket } from 'socket.io';

interface WindowState {
  count: number;
  windowStart: number;
}

/**
 * Creates a Socket.io server-level middleware that enforces per-socket event rate limiting
 * using a fixed-window algorithm.
 *
 * Register the returned middleware via `server.use(createRateLimiter())` in `afterInit`.
 * Each socket tracks its own event count independently — bursts from one client cannot
 * affect another.
 *
 * @param maxEvents - Maximum number of events allowed within a single window. Defaults to `30`.
 * @param windowMs - Duration of each fixed window in milliseconds. Defaults to `10000` (10 seconds).
 * @returns A Socket.io middleware function suitable for `server.use(...)`.
 *
 * @example
 * // In a gateway's afterInit:
 * afterInit(server: Server): void {
 *   server.use(createRateLimiter(30, 10_000));
 * }
 */
export function createRateLimiter(
  maxEvents = 30,
  windowMs = 10_000,
): (socket: Socket, next: (err?: Error) => void) => void {
  const windows = new Map<string, WindowState>();

  return (socket: Socket, next: (err?: Error) => void): void => {
    windows.set(socket.id, { count: 0, windowStart: Date.now() });

    socket.use(([_event, ..._args], socketNext) => {
      const now = Date.now();
      const state = windows.get(socket.id);

      if (!state) {
        socketNext();
        return;
      }

      if (now > state.windowStart + windowMs) {
        state.count = 0;
        state.windowStart = now;
      }

      state.count += 1;

      if (state.count > maxEvents) {
        socketNext(new Error('Rate limit exceeded'));
        return;
      }

      socketNext();
    });

    socket.on('disconnect', () => {
      windows.delete(socket.id);
    });

    next();
  };
}
