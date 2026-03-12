import { Heart } from 'lucide-react';

interface ScoreBoardProps {
  /** Current score. */
  score: number;
  /** Remaining lives. null means infinite mode. */
  lives: number | null;
}

const MAX_DISPLAYED_LIVES = 10;

/**
 * Displays the current score and lives. In infinite mode, shows ∞ instead
 * of heart icons.
 *
 * @example
 * <ScoreBoard score={5} lives={3} />
 * <ScoreBoard score={12} lives={null} />
 */
export function ScoreBoard({ score, lives }: ScoreBoardProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-cream-200 bg-cream-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-800">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Score
        </p>
        <p className="font-serif text-4xl font-bold text-navy-900 dark:text-cream-100">
          {score}
        </p>
      </div>

      <div className="text-center">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Lives
        </p>
        {lives === null ? (
          <span className="font-serif text-3xl text-navy-900 dark:text-cream-100">
            ∞
          </span>
        ) : (
          <div className="flex flex-wrap justify-center gap-1">
            {Array.from({ length: Math.min(lives, MAX_DISPLAYED_LIVES) }).map(
              (_, i) => (
                <Heart
                  key={i}
                  className="h-5 w-5 fill-burgundy-600 text-burgundy-600 dark:fill-burgundy-500 dark:text-burgundy-500"
                />
              ),
            )}
            {lives > MAX_DISPLAYED_LIVES && (
              <span className="text-sm font-medium text-slate-500">
                +{lives - MAX_DISPLAYED_LIVES}
              </span>
            )}
            {lives === 0 && (
              <span className="text-sm text-slate-400 dark:text-slate-500">
                none
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
