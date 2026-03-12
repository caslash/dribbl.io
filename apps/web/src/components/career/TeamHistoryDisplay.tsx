import { Badge } from '@/components/Badge';

interface TeamHistoryDisplayProps {
  /** Ordered list of team abbreviations representing the player's career path. */
  teamHistory: string[];
}

/**
 * Renders the ordered career path sequence as a horizontal row of team
 * abbreviation badges separated by arrows. Scrolls horizontally when
 * the sequence is long.
 *
 * @example
 * <TeamHistoryDisplay teamHistory={["LAL", "MIA", "CLE", "LAL"]} />
 */
export function TeamHistoryDisplay({ teamHistory }: TeamHistoryDisplayProps) {
  return (
    <div className="flex justify-center overflow-x-auto pb-2">
      <div className="flex items-center gap-2">
        {teamHistory.map((abbr, i) => (
          <div key={i} className="flex items-center gap-2">
            <Badge label={abbr} size="md" className="text-base px-4 py-1.5" />
            {i < teamHistory.length - 1 && (
              <span className="text-slate-400 dark:text-slate-500 text-lg select-none">
                →
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
