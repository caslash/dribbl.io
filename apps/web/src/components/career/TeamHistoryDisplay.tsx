interface TeamHistoryDisplayProps {
  /** Ordered list of team abbreviations representing the player's career path. */
  teamHistory: string[];
}

function TeamLogo({ teamId }: { teamId: number | string }) {
  return (
    <div className="flex justify-center p-4 bg-surface-warm rounded-md">
      <img src={`/logos/${teamId}.svg`} height={100} width={100} />
    </div>
  );
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
        {teamHistory.map((id, i) => (
          <div key={i} className="flex items-center gap-2">
            <TeamLogo teamId={id} />
            {i < teamHistory.length - 1 && (
              <span className="text-text-placeholder text-xl select-none">→</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
