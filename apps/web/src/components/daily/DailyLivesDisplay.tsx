import { motion, useReducedMotion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface DailyLivesDisplayProps {
  /** Current remaining lives. */
  lives: number;
  /** Maximum number of lives (controls how many heart icons render). Defaults to 3. */
  maxLives?: number;
  /** Total named count for the progress label. */
  namedCount: number;
  /** Total roster size for the progress label. */
  rosterSize: number;
}

/**
 * Displays heart icons for remaining lives with a bounce animation on loss,
 * and a named count progress label.
 *
 * @example
 * <DailyLivesDisplay lives={2} namedCount={5} rosterSize={14} />
 */
export function DailyLivesDisplay({
  lives,
  maxLives = 3,
  namedCount,
  rosterSize,
}: DailyLivesDisplayProps) {
  const prefersReducedMotion = useReducedMotion();
  const prevLivesRef = useRef(lives);
  // Track which heart index is animating so only that one bounces
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (lives < prevLivesRef.current) {
      // The heart that was just lost is the one at index `lives` (0-based)
      setAnimatingIndex(lives);
      prevLivesRef.current = lives;
    }
  }, [lives]);

  const handleAnimationComplete = (index: number) => {
    if (index === animatingIndex) {
      setAnimatingIndex(null);
    }
  };

  return (
    <div role="status" aria-live="polite" className="flex items-center justify-between px-1 pb-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-text-muted">
          Lives
        </span>
        <div className="flex items-center gap-1">
          {Array.from({ length: maxLives }).map((_, i) => {
            const isFilled = i < lives;
            const isAnimating = i === animatingIndex && !prefersReducedMotion;

            return (
              <motion.span
                key={i}
                animate={isAnimating ? { scale: [1, 1.4, 0.85, 1] } : { scale: 1 }}
                transition={isAnimating ? { duration: 0.35 } : undefined}
                onAnimationComplete={() => handleAnimationComplete(i)}
                aria-hidden="true"
              >
                <Heart
                  className={`h-5 w-5 ${
                    isFilled ? 'fill-accent text-accent' : 'fill-transparent text-border'
                  }`}
                />
              </motion.span>
            );
          })}
        </div>
      </div>

      <span className="text-sm font-semibold text-text-secondary">
        {namedCount} / {rosterSize} named
      </span>
    </div>
  );
}
