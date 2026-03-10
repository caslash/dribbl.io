import { io, Socket } from 'socket.io-client';
import { CONNECTION_TIMEOUT_MS, WS_NAMESPACE, WS_URL } from './config.js';
import type { ServerEvent } from './types.js';

export type GameSocket = Socket;

// ─── Connection ───────────────────────────────────────────────────────────────

export function createSocket(roomId?: string): GameSocket {
  const query = roomId ? { roomId } : {};
  return io(`${WS_URL}${WS_NAMESPACE}`, {
    query,
    transports: ['websocket'],
  });
}

export async function connectSocket(socket: GameSocket): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error('Connection timed out')),
      CONNECTION_TIMEOUT_MS,
    );

    socket.once('connect', () => {
      clearTimeout(timer);
      resolve();
    });

    socket.once('connect_error', (err: Error) => {
      clearTimeout(timer);
      reject(new Error(`Cannot connect: ${err.message}`));
    });
  });
}

// ─── Event helpers ────────────────────────────────────────────────────────────

type EventNames = ServerEvent['type'];

/**
 * Returns a Promise that resolves with the first matching server event.
 * Rejects on ERROR or disconnect.
 */
export function waitForEvent<T extends EventNames>(
  socket: GameSocket,
  ...eventNames: T[]
): Promise<Extract<ServerEvent, { type: T }>> {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sock = socket as any;
    const handlers = new Map<string, (...args: unknown[]) => void>();

    const cleanup = (): void => {
      for (const [event, handler] of handlers) {
        sock.off(event, handler);
      }
    };

    for (const name of eventNames) {
      const handler = (data: unknown): void => {
        cleanup();
        resolve({ ...(data as object), type: name } as Extract<ServerEvent, { type: T }>);
      };
      handlers.set(name, handler);
      sock.on(name, handler);
    }

    const errorHandler = (err: unknown): void => {
      cleanup();
      const msg =
        err != null && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'Socket error';
      reject(new Error(msg));
    };
    handlers.set('ERROR', errorHandler);
    sock.on('ERROR', errorHandler);

    const disconnectHandler = (): void => {
      cleanup();
      reject(new Error('Disconnected from server'));
    };
    handlers.set('disconnect', disconnectHandler);
    sock.on('disconnect', disconnectHandler);
  });
}
