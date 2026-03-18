import type { PoolEntry } from '@dribblio/types';

interface PoolEntryRowProps {
  /** The pool entry to display. */
  entry: PoolEntry;
  /** Whether this entry is still available to be picked. */
  available: boolean;
  /** Called when the user clicks the row to select it. */
  onSelect?: () => void;
  /** Whether it is currently the viewing user's turn. */
  isMyTurn?: boolean;
}

/**
 * Row-style display for a single draft pool entry.
 *
 * Renders a small player headshot, player name, subtitle, and stat pills.
 * For MVP mode entries, shows PTS, AST, and REB per game.
 * Unavailable entries are grayed out with a strikethrough name and are non-interactive.
 * When available and it is the user's turn, hovering highlights the row.
 *
 * @param entry - The pool entry to display.
 * @param available - Whether this entry can still be picked.
 * @param onSelect - Called when the user clicks to select the entry.
 * @param isMyTurn - Whether it is currently the viewing user's turn.
 *
 * @example
 * <PoolEntryRow entry={entry} available={true} isMyTurn={true} onSelect={() => setSelected(entry)} />
 */
export function PoolEntryRow({ entry, available, onSelect, isMyTurn }: PoolEntryRowProps) {
  const clickable = available && isMyTurn && !!onSelect;

  const subtitle =
    entry.draftMode === 'mvp'
      ? entry.season
      : `${entry.franchiseName} (${entry.franchiseAbbr})`;

  return (
    <button
      type="button"
      disabled={!clickable}
      onClick={clickable ? onSelect : undefined}
      aria-label={`Select ${entry.playerName}${available ? '' : ' (unavailable)'}`}
      className={`w-full flex items-center gap-3 rounded-lg border px-3 py-2 text-left transition-colors ${
        available
          ? `bg-surface-raised border-primary-border ${
              clickable
                ? 'hover:border-red-600 hover:bg-surface-warm cursor-pointer'
                : 'cursor-default'
            }`
          : 'bg-surface-warm border-primary-border opacity-50 cursor-not-allowed'
      }`}
    >
      {/* Headshot */}
      <img
        src={`https://cdn.nba.com/headshots/nba/latest/260x190/${entry.playerId}.png`}
        alt={entry.playerName}
        width={40}
        height={30}
        className="object-cover rounded shrink-0"
      />

      {/* Name + subtitle */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-semibold leading-tight truncate ${!available ? 'line-through text-text-muted' : ''}`}
        >
          {entry.playerName}
        </p>
        <p className="text-xs text-text-muted truncate">{subtitle}</p>
      </div>

      {/* Stat pills — MVP mode only */}
      {entry.draftMode === 'mvp' && (
        <div className="flex gap-1 shrink-0">
          <StatPill label="PTS" value={entry.ptsPg} />
          <StatPill label="AST" value={entry.astPg} />
          <StatPill label="REB" value={entry.rebPg} />
        </div>
      )}
    </button>
  );
}

interface StatPillProps {
  /** The stat label, e.g. "PTS", "AST", "REB". */
  label: string;
  /** The per-game stat value, or null if unavailable. */
  value: number | null;
}

/**
 * Compact pill displaying a single per-game stat with a label above the value.
 *
 * @param label - The stat abbreviation, e.g. "PTS".
 * @param value - The numeric value to display; shows "–" if null.
 *
 * @example
 * <StatPill label="PTS" value={28.4} />
 * <StatPill label="AST" value={null} />
 */
export function StatPill({ label, value }: StatPillProps) {
  return (
    <span className="inline-flex flex-col items-center rounded bg-primary-border/30 px-1.5 py-0.5 text-center">
      <span className="text-[10px] text-text-muted leading-none">{label}</span>
      <span className="text-xs font-semibold leading-tight">
        {value != null ? Number(value).toFixed(1) : '-'}
      </span>
    </span>
  );
}
