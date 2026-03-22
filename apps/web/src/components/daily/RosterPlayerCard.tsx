import { motion } from 'framer-motion';
import type { NamedPlayer } from '@/providers/DailyRosterProvider';

interface RosterPlayerCardProps {
  /** The player data to display. */
  player: NamedPlayer;
  /**
   * When true, renders in the "missed" style (accent left border, muted name).
   * Used for players revealed at game-over that the user did not name.
   */
  missed?: boolean;
}

/**
 * Displays a single named or missed player in the roster grid.
 *
 * @example
 * <RosterPlayerCard player={player} />
 * <RosterPlayerCard player={player} missed />
 */
export function RosterPlayerCard({ player, missed = false }: RosterPlayerCardProps) {
  return (
    <motion.div
      role="listitem"
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
      className={`rounded-lg border border-border bg-surface-raised p-4 border-l-2 h-20 flex flex-col justify-center ${
        missed ? 'border-l-accent' : 'border-l-primary'
      }`}
    >
      <p className="text-xs font-semibold text-text-muted uppercase tracking-widest">
        {player.jerseyNumber ? `#${player.jerseyNumber}` : '—'}
      </p>
      <p
        className={`text-sm font-semibold leading-tight mt-0.5 ${
          missed ? 'text-text-secondary' : 'text-text-primary'
        }`}
      >
        {player.fullName}
      </p>
      <p className="text-xs text-text-muted mt-0.5">
        {player.position ?? '—'}
      </p>
    </motion.div>
  );
}
