'use client';

import { cn } from '@/lib/utils';
import { motion, useAnimation } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

interface TurnTimerProps {
  /** Total countdown duration in seconds. */
  durationSeconds: number;
  /** Called when the countdown reaches zero. */
  onExpire: () => void;
}

const RADIUS = 38;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Animated SVG countdown ring that depletes over `durationSeconds`.
 *
 * Turns red and pulses in the last 5 seconds. Calls `onExpire` exactly once when
 * the timer reaches zero.
 *
 * Uses `motion` (framer-motion) for the ring animation and a `setInterval` for the
 * numeric display — these are kept in sync via `Date.now()` rather than relying on
 * interval precision.
 *
 * @param durationSeconds - How long (in seconds) the timer runs.
 * @param onExpire - Callback fired when the timer hits zero.
 *
 * @example
 * <TurnTimer durationSeconds={60} onExpire={() => emitTimerExpired()} />
 */
export function TurnTimer({ durationSeconds, onExpire }: TurnTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);
  const startTimeRef = useRef(Date.now());
  const expiredRef = useRef(false);
  const ringControls = useAnimation();

  // Animate the ring stroke from full to empty over the duration
  useEffect(() => {
    startTimeRef.current = Date.now();
    expiredRef.current = false;
    setSecondsLeft(durationSeconds);

    ringControls.set({ strokeDashoffset: 0 });
    ringControls.start({
      strokeDashoffset: CIRCUMFERENCE,
      transition: { duration: durationSeconds, ease: 'linear' },
    });
  }, [durationSeconds, ringControls]);

  // Drive the numeric countdown with an interval
  useEffect(() => {
    const id = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const remaining = Math.max(0, durationSeconds - elapsed);
      setSecondsLeft(Math.ceil(remaining));

      if (remaining <= 0 && !expiredRef.current) {
        expiredRef.current = true;
        clearInterval(id);
        onExpire();
      }
    }, 200);

    return () => clearInterval(id);
  }, [durationSeconds, onExpire]);

  const isWarning = secondsLeft <= 5;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-24 h-24">
        <svg
          viewBox="0 0 88 88"
          className={cn('w-full h-full -rotate-90', isWarning && 'animate-pulse')}
          aria-hidden="true"
        >
          {/* Track ring */}
          <circle
            cx="44"
            cy="44"
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-muted-foreground/20"
          />
          {/* Progress ring */}
          <motion.circle
            cx="44"
            cy="44"
            r={RADIUS}
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            animate={ringControls}
            className={cn(
              'transition-colors',
              isWarning ? 'stroke-destructive' : 'stroke-primary',
            )}
          />
        </svg>
        {/* Numeric display */}
        <span
          className={cn(
            'absolute inset-0 flex items-center justify-center text-2xl font-bold rotate-0',
            isWarning ? 'text-destructive' : 'text-foreground',
          )}
        >
          {secondsLeft}
        </span>
      </div>
      <p className="text-xs text-muted-foreground">seconds left</p>
    </div>
  );
}
