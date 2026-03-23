import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import { useState } from 'react';
import type { NamedPlayer } from '@/providers/DailyRosterProvider';

interface PlayerHeadshotProps {
  playerId: number;
  playerName: string;
}

/**
 * Player headshot image with a grey box fallback for missing CDN images.
 *
 * @param playerId - The NBA CDN player ID.
 * @param playerName - Used as the img alt text.
 *
 * @example
 * <PlayerHeadshot playerId={2544} playerName="LeBron James" />
 */
function PlayerHeadshot({ playerId, playerName }: PlayerHeadshotProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <div className="w-10 h-[30px] rounded bg-surface-warm shrink-0" />;
  }

  return (
    <img
      src={`https://cdn.nba.com/headshots/nba/latest/260x190/${playerId}.png`}
      alt={playerName}
      width={40}
      height={30}
      className="object-cover rounded shrink-0"
      onError={() => setFailed(true)}
    />
  );
}

interface RosterPlayerRowProps {
  /** The player data to display. */
  player: NamedPlayer;
  /**
   * When true, renders in the "missed" style (accent left border, muted name).
   * Used for players revealed at game-over that the user did not name.
   */
  missed?: boolean;
}

/**
 * Row-style display for a single named or missed roster player.
 * Follows the same visual pattern as `PoolEntryRow`.
 *
 * @example
 * <RosterPlayerRow player={player} />
 * <RosterPlayerRow player={player} missed />
 */
export function RosterPlayerRow({ player, missed = false }: RosterPlayerRowProps) {
  return (
    <motion.div
      role="listitem"
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
      className={`flex items-center gap-3 rounded-lg border border-border bg-surface-raised px-3 py-2 border-l-2 ${
        missed ? 'border-l-accent' : 'border-l-primary'
      }`}
    >
      <PlayerHeadshot playerId={player.playerId} playerName={player.fullName} />

      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-widest">
          {player.jerseyNumber ? `#${player.jerseyNumber}` : '—'}
        </p>
        <p
          className={`text-sm font-semibold leading-tight truncate ${
            missed ? 'text-text-secondary' : 'text-text-primary'
          }`}
        >
          {player.fullName}
        </p>
        <p className="text-xs text-text-muted">{player.position ?? '—'}</p>
      </div>
    </motion.div>
  );
}

/**
 * Placeholder row shown for an unrevealed roster slot.
 *
 * @example
 * <RosterPlayerRowPlaceholder />
 */
export function RosterPlayerRowPlaceholder() {
  return (
    <div
      role="listitem"
      aria-label="Unknown player"
      className="flex items-center gap-3 rounded-lg border border-dashed border-border bg-surface px-3 py-2"
    >
      <div className="w-10 h-[30px] rounded bg-surface-warm shrink-0" />
      <HelpCircle className="h-5 w-5 text-text-placeholder" />
    </div>
  );
}
