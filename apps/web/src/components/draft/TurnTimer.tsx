import { motion, useAnimation } from 'framer-motion';
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
 * Uses `motion` (framer-motion) for the ring animation and a 1-second `setInterval`
 * for the numeric display. The interval decrements a ref-backed counter so the
 * countdown is fully controllable by fake timers in tests without any `Date.now()`
 * dependency.
 *
 * @param durationSeconds - How long (in seconds) the timer runs.
 * @param onExpire - Callback fired when the timer hits zero.
 *
 * @example
 * <TurnTimer durationSeconds={60} onExpire={() => emitTimerExpired()} />
 */
export function TurnTimer({ durationSeconds, onExpire }: TurnTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);
  const secondsLeftRef = useRef(durationSeconds);
  const expiredRef = useRef(false);
  const ringControls = useAnimation();

  // Animate the ring stroke from full to empty over the duration
  useEffect(() => {
    secondsLeftRef.current = durationSeconds;
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
      const next = secondsLeftRef.current - 1;
      secondsLeftRef.current = next;
      setSecondsLeft(next);

      if (next <= 0 && !expiredRef.current) {
        expiredRef.current = true;
        clearInterval(id);
        onExpire();
      }
    }, 1000);

    return () => clearInterval(id);
  }, [durationSeconds, onExpire]);

  const isWarning = secondsLeft <= 5;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-14 h-14">
        <svg
          viewBox="0 0 88 88"
          className={`w-full h-full -rotate-90 ${isWarning ? 'animate-pulse' : ''}`}
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
            className="text-primary-border"
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
            className={`transition-colors ${isWarning ? 'stroke-error' : 'stroke-primary'}`}
          />
        </svg>
        {/* Numeric display */}
        <span
          className={`absolute inset-0 flex items-center justify-center text-base font-bold rotate-0 ${
            isWarning ? 'text-error' : 'text-text-primary'
          }`}
        >
          {secondsLeft}
        </span>
      </div>
    </div>
  );
}
