import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import type { PlayerResult } from '@/providers/CareerPathProvider';

type FeedbackResult = 'correct' | 'incorrect' | 'skip';

interface RoundFeedbackProps {
  result: FeedbackResult;
  /** Players with the same career path — shown on correct guesses. */
  validAnswers: PlayerResult[];
  /** Remaining lives after this result. null = infinite mode. */
  lives: number | null;
  /** Called when the feedback panel dismisses (auto after 2.5s or on click). */
  onDismiss: () => void;
}

const CONFIG: Record<
  FeedbackResult,
  { heading: string; bgClass: string; textClass: string }
> = {
  correct: {
    heading: 'Correct!',
    bgClass: 'bg-success-light dark:bg-success/20 border-success',
    textClass: 'text-success',
  },
  incorrect: {
    heading: 'Incorrect',
    bgClass: 'bg-error-light dark:bg-error/20 border-error',
    textClass: 'text-error',
  },
  skip: {
    heading: 'Skipped',
    bgClass:
      'bg-warning-light dark:bg-warning/20 border-warning dark:border-warning',
    textClass: 'text-warning',
  },
};

/**
 * Animated feedback overlay shown after each guess or skip.
 * Auto-dismisses after 2.5 seconds; can also be dismissed by clicking.
 *
 * @example
 * {state.lastResult && (
 *   <RoundFeedback
 *     result={state.lastResult}
 *     validAnswers={state.validAnswers}
 *     lives={state.lives}
 *     onDismiss={handleDismiss}
 *   />
 * )}
 */
export function RoundFeedback({
  result,
  validAnswers,
  lives,
  onDismiss,
}: RoundFeedbackProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 2500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const { heading, bgClass, textClass } = CONFIG[result];

  return (
    <AnimatePresence>
      <motion.div
        key={result}
        initial={{ opacity: 0, scale: 0.95, y: -8 }}
        animate={
          result === 'incorrect'
            ? {
                opacity: 1,
                scale: 1,
                y: 0,
                // Shake animation for wrong answers
                x: [0, -8, 8, -6, 6, -4, 4, 0],
                transition: {
                  opacity: { duration: 0.15 },
                  scale: { duration: 0.15 },
                  y: { duration: 0.15 },
                  x: { duration: 0.4, ease: 'easeInOut' },
                },
              }
            : { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2 } }
        }
        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
        onClick={onDismiss}
        className={`cursor-pointer rounded-lg border p-5 ${bgClass}`}
        role="status"
        aria-live="polite"
      >
        <h3 className={`text-center text-xl font-bold ${textClass}`}>
          {heading}
        </h3>

        {result === 'correct' && validAnswers.length > 0 && (
          <div className="mt-3 text-center">
            <p className="mb-1.5 text-sm font-medium text-slate-600 dark:text-slate-300">
              Valid answers:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {validAnswers.map((p) => (
                <span
                  key={p.playerId}
                  className="rounded-full bg-success/20 px-3 py-0.5 text-sm font-medium text-success dark:bg-success/30"
                >
                  {p.fullName}
                </span>
              ))}
            </div>
          </div>
        )}

        {result === 'incorrect' && (
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-300">
            {lives === null
              ? 'Score reset to 0'
              : lives === 0
                ? 'No lives remaining'
                : `${lives} ${lives === 1 ? 'life' : 'lives'} remaining`}
          </p>
        )}

        {result === 'skip' && (
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-300">
            {lives === null
              ? 'Score reset to 0'
              : lives === 0
                ? 'No lives remaining'
                : `${lives} ${lives === 1 ? 'life' : 'lives'} remaining`}
          </p>
        )}

        <p className="mt-3 text-center text-xs text-slate-400 dark:text-slate-500">
          Click or wait to continue
        </p>
      </motion.div>
    </AnimatePresence>
  );
}
