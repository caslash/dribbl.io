import { useState } from 'react';
import { User } from 'lucide-react';
import type { PickRecord, PoolEntry } from '@dribblio/types';
import { StatPill } from '@/components/draft/PoolEntryRow';

interface MyPickCardProps {
  /** The completed pick record. */
  pick: PickRecord;
  /** The resolved pool entry, or undefined if the entry is missing from the pool. */
  entry: PoolEntry | undefined;
  /** When true, renders a smaller headshot for compact grid layouts. */
  compact?: boolean;
}

/**
 * Displays a single drafted player card on the "My Team" results panel.
 *
 * Renders a player headshot with a graceful fallback to a user icon if the
 * NBA CDN image fails to load. For MVP mode entries, stat pills (PTS, AST,
 * REB) are shown beneath the player name.
 *
 * @param pick - The completed pick record (round, pickNumber, entryId).
 * @param entry - The resolved pool entry for the pick; undefined if missing.
 * @param compact - When true, renders a smaller headshot width (90 vs 130).
 *
 * @example
 * <MyPickCard pick={pick} entry={resolvePickEntry(pick, pool)} />
 * <MyPickCard pick={pick} entry={entry} compact />
 */
export function MyPickCard({ pick, entry, compact = false }: MyPickCardProps) {
  const [imgFailed, setImgFailed] = useState(false);

  const headshotWidth = compact ? 90 : 130;
  const headshotHeight = compact ? 66 : 95;

  const playerName = entry?.playerName ?? pick.entryId;
  const subtitle =
    entry?.draftMode === 'mvp'
      ? entry.season
      : entry?.draftMode === 'franchise'
        ? `${entry.franchiseName} (${entry.franchiseAbbr})`
        : pick.entryId;

  const altText = `${playerName}, round ${pick.round} pick ${pick.pickNumber}`;

  return (
    <div className="flex flex-col rounded-lg border border-primary-border bg-surface-raised p-3 gap-2">
      {/* Headshot with fallback */}
      <div className="relative w-full" style={{ aspectRatio: `${headshotWidth} / ${headshotHeight}` }}>
        {entry && !imgFailed ? (
          <img
            src={`https://cdn.nba.com/headshots/nba/latest/260x190/${entry.playerId}.png`}
            alt={altText}
            width={headshotWidth}
            height={headshotHeight}
            className="object-cover mask-b-from-75% mask-b-to-90% w-full h-full"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              setImgFailed(true);
            }}
          />
        ) : null}
        {(!entry || imgFailed) && (
          <div className="absolute inset-0 bg-surface-warm rounded-md flex items-center justify-center">
            <User size={32} className="text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Player info */}
      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-semibold leading-snug truncate">{playerName}</p>
        <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          R{pick.round} · Pick {pick.pickNumber}
        </p>
      </div>

      {/* Stat pills — MVP mode only */}
      {entry?.draftMode === 'mvp' && (
        <div className="flex gap-1 flex-wrap">
          <StatPill label="PTS" value={entry.ptsPg} />
          <StatPill label="AST" value={entry.astPg} />
          <StatPill label="REB" value={entry.rebPg} />
        </div>
      )}
    </div>
  );
}
