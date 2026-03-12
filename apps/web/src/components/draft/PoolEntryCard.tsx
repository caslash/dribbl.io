'use client';

import { PoolEntry } from '@/components/draft/types';
import { cn } from '@/lib/utils';

interface PoolEntryCardProps {
  entry: PoolEntry;
  available: boolean;
  onPick?: () => void;
  isMyTurn?: boolean;
}

/**
 * Displays a single entry in the draft pool grid.
 *
 * Renders differently based on the entry's `draftMode` discriminant:
 * - MVP mode: shows the season year below the player name
 * - Franchise mode: shows the franchise name/abbreviation below the player name
 *
 * When unavailable (picked/invalidated), the card is grayed out and non-interactive.
 * When it's the current user's turn and the entry is available, hovering highlights
 * the card with a prominent border.
 *
 * @param entry - The pool entry to display.
 * @param available - Whether this entry can still be picked.
 * @param onPick - Called when the user clicks to draft this entry.
 * @param isMyTurn - Whether it is currently the logged-in user's turn.
 *
 * @example
 * <PoolEntryCard entry={entry} available={!invalidatedIds.has(entry.entryId)} onPick={() => submitPick(entry.entryId)} isMyTurn={isMyTurn} />
 */
export function PoolEntryCard({ entry, available, onPick, isMyTurn }: PoolEntryCardProps) {
  const clickable = available && isMyTurn && !!onPick;

  const subtitle =
    entry.draftMode === 'mvp'
      ? entry.season
      : `${entry.franchiseName} (${entry.franchiseAbbr})`;

  return (
    <button
      type="button"
      disabled={!clickable}
      onClick={clickable ? onPick : undefined}
      aria-label={`Pick ${entry.playerName}${available ? '' : ' (unavailable)'}`}
      className={cn(
        'rounded-lg border p-3 text-left transition-all',
        available
          ? cn(
              'bg-card text-card-foreground border-border',
              clickable && 'hover:border-destructive hover:shadow-md cursor-pointer',
              !isMyTurn && 'cursor-default',
            )
          : 'bg-muted text-muted-foreground border-border opacity-50 cursor-not-allowed',
      )}
    >
      <p
        className={cn(
          'text-sm font-semibold leading-snug',
          !available && 'line-through',
        )}
      >
        {entry.playerName}
      </p>
      <p className="text-xs text-muted-foreground mt-0.5 truncate">{subtitle}</p>
    </button>
  );
}
