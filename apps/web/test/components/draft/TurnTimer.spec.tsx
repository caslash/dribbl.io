import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TurnTimer } from '@/components/draft/TurnTimer';

// framer-motion is not compatible with jsdom.
// Stub the motion primitive to a plain circle so tests don't fail on SVG animation APIs.
//
// `useAnimation` must return a stable object reference across renders. If the factory
// returns a new object every call, the `ringControls` reference changes on every render,
// causing the ring animation useEffect to fire continuously. Each fire calls
// `start().mockResolvedValue(undefined)`, queuing microtasks that keep React busy and
// prevent setInterval ticks from being observed in tests.
const ringControls = { set: vi.fn(), start: vi.fn().mockResolvedValue(undefined) };

vi.mock('framer-motion', () => ({
  motion: {
    // Strip the `animate` prop — passing an object to a plain DOM <circle> causes
    // React to suppress state updates during fake-timer advancement in jsdom.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    circle: ({ animate: _animate, ...props }: any) => <circle {...props} />,
  },
  useAnimation: () => ringControls,
}));

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('TurnTimer', () => {
  describe('initial display', () => {
    it('renders the full duration on mount', () => {
      render(<TurnTimer durationSeconds={30} onExpire={vi.fn()} />);

      expect(screen.getByText('30')).toBeInTheDocument();
    });

    it('renders only the numeric countdown with no label', () => {
      render(<TurnTimer durationSeconds={60} onExpire={vi.fn()} />);

      expect(screen.getByText('60')).toBeInTheDocument();
      expect(screen.queryByText('seconds left')).not.toBeInTheDocument();
    });
  });

  describe('countdown', () => {
    it('decrements the displayed value as time advances', () => {
      render(<TurnTimer durationSeconds={10} onExpire={vi.fn()} />);

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(screen.getByText('7')).toBeInTheDocument();
    });

    it('shows 0 after the full duration has elapsed', () => {
      render(<TurnTimer durationSeconds={5} onExpire={vi.fn()} />);

      act(() => {
        vi.advanceTimersByTime(5200);
      });

      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });

  describe('onExpire callback', () => {
    it('calls onExpire exactly once when the timer reaches zero', () => {
      const onExpire = vi.fn();
      render(<TurnTimer durationSeconds={5} onExpire={onExpire} />);

      act(() => {
        vi.advanceTimersByTime(6000);
      });

      expect(onExpire).toHaveBeenCalledOnce();
    });

    it('does not call onExpire a second time after expiry even if more time passes', () => {
      const onExpire = vi.fn();
      render(<TurnTimer durationSeconds={5} onExpire={onExpire} />);

      act(() => {
        vi.advanceTimersByTime(10000);
      });

      expect(onExpire).toHaveBeenCalledOnce();
    });

    it('does not call onExpire before the duration has elapsed', () => {
      const onExpire = vi.fn();
      render(<TurnTimer durationSeconds={10} onExpire={onExpire} />);

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(onExpire).not.toHaveBeenCalled();
    });
  });

  describe('warning state', () => {
    it('applies the animate-pulse class when 5 seconds or fewer remain', () => {
      const { container } = render(<TurnTimer durationSeconds={10} onExpire={vi.fn()} />);

      act(() => {
        vi.advanceTimersByTime(5500);
      });

      const svg = container.querySelector('svg');
      const className = svg?.getAttribute('class') ?? '';
      expect(className).toContain('animate-pulse');
    });

    it('does not apply animate-pulse when more than 5 seconds remain (initial render)', () => {
      const { container } = render(<TurnTimer durationSeconds={20} onExpire={vi.fn()} />);

      const svg = container.querySelector('svg');
      const className = svg?.getAttribute('class') ?? '';
      expect(className).not.toContain('animate-pulse');
    });
  });

  describe('reset on durationSeconds change', () => {
    it('resets to the new duration when durationSeconds prop changes', () => {
      const { rerender } = render(<TurnTimer durationSeconds={10} onExpire={vi.fn()} />);

      act(() => {
        vi.advanceTimersByTime(4000);
      });

      rerender(<TurnTimer durationSeconds={30} onExpire={vi.fn()} />);

      expect(screen.getByText('30')).toBeInTheDocument();
    });
  });
});
