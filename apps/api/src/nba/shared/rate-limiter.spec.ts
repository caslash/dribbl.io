import { createRateLimiter } from './rate-limiter';

const makeSocket = (id: string) => {
  const middlewares: Array<(packet: unknown[], next: (err?: Error) => void) => void> = [];
  const listeners: Record<string, Array<() => void>> = {};

  return {
    id,
    use: vi.fn((fn: (packet: unknown[], next: (err?: Error) => void) => void) => {
      middlewares.push(fn);
    }),
    on: vi.fn((event: string, cb: () => void) => {
      listeners[event] = listeners[event] ?? [];
      listeners[event].push(cb);
    }),
    /** Simulate an inbound event through the per-socket middleware chain. */
    simulateEvent: (next: (err?: Error) => void) => {
      for (const mw of middlewares) {
        mw(['TEST_EVENT'], next);
      }
    },
    /** Trigger the disconnect listeners. */
    simulateDisconnect: () => {
      (listeners['disconnect'] ?? []).forEach((cb) => cb());
    },
  };
};

describe('createRateLimiter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('calls next without an error when a socket is below the event limit', () => {
    const middleware = createRateLimiter(5, 10_000);
    const socket = makeSocket('s1');
    const serverNext = vi.fn();
    const socketNext = vi.fn();

    middleware(socket as any, serverNext);

    expect(serverNext).toHaveBeenCalledWith();

    socket.simulateEvent(socketNext);

    expect(socketNext).toHaveBeenCalledWith();
    expect(socketNext).not.toHaveBeenCalledWith(expect.any(Error));
  });

  it('passes an error to next when a socket exceeds the limit within the window', () => {
    const maxEvents = 3;
    const middleware = createRateLimiter(maxEvents, 10_000);
    const socket = makeSocket('s2');
    const serverNext = vi.fn();
    const socketNext = vi.fn();

    middleware(socket as any, serverNext);

    for (let i = 0; i < maxEvents; i++) {
      socket.simulateEvent(socketNext);
    }

    expect(socketNext).not.toHaveBeenCalledWith(expect.any(Error));

    socket.simulateEvent(socketNext);

    expect(socketNext).toHaveBeenLastCalledWith(
      expect.objectContaining({ message: 'Rate limit exceeded' }),
    );
  });

  it('resets the counter after the window expires and allows events again', () => {
    vi.useFakeTimers();

    const windowMs = 5_000;
    const maxEvents = 2;
    const middleware = createRateLimiter(maxEvents, windowMs);
    const socket = makeSocket('s3');
    const serverNext = vi.fn();
    const socketNext = vi.fn();

    middleware(socket as any, serverNext);

    for (let i = 0; i < maxEvents; i++) {
      socket.simulateEvent(socketNext);
    }

    // Exceeds the limit — should error
    socket.simulateEvent(socketNext);
    expect(socketNext).toHaveBeenLastCalledWith(expect.any(Error));

    // Advance past the window boundary
    vi.advanceTimersByTime(windowMs + 1);

    const afterResetNext = vi.fn();
    socket.simulateEvent(afterResetNext);

    expect(afterResetNext).toHaveBeenCalledWith();
    expect(afterResetNext).not.toHaveBeenCalledWith(expect.any(Error));
  });

  it('cleans up the map entry when the socket disconnects', () => {
    const maxEvents = 2;
    const middleware = createRateLimiter(maxEvents, 10_000);
    const socket = makeSocket('s4');
    const serverNext = vi.fn();
    const socketNext = vi.fn();

    middleware(socket as any, serverNext);

    socket.simulateDisconnect();

    // After disconnect the state entry is gone — the middleware guard falls through to socketNext()
    socket.simulateEvent(socketNext);
    expect(socketNext).toHaveBeenCalledWith();
    expect(socketNext).not.toHaveBeenCalledWith(expect.any(Error));
  });
});
