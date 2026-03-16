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
    <div className="flex items-center justify-between rounded-lg border border-border bg-surface-raised px-6 py-4">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Score
        </p>
        <p className="font-serif text-4xl font-bold text-text-primary">
          {score}
        </p>
      </div>

      <div className="text-center">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-text-muted">
          Lives
        </p>
        {lives === null ? (
          <span className="font-serif text-3xl text-text-primary">
            ∞
          </span>
        ) : (
          <div className="flex flex-wrap justify-center gap-1">
            {Array.from({ length: Math.min(lives, MAX_DISPLAYED_LIVES) }).map(
              (_, i) => (
                <Heart
                  key={i}
                  className="h-5 w-5 fill-red-600 text-red-600"
                />
              ),
            )}
            {lives > MAX_DISPLAYED_LIVES && (
              <span className="text-sm font-medium text-text-muted">
                +{lives - MAX_DISPLAYED_LIVES}
              </span>
            )}
            {lives === 0 && (
              <span className="text-sm text-text-placeholder">
                none
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
