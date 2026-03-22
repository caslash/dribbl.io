import { HelpCircle } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { RosterPlayerCard } from './RosterPlayerCard';
import type { NamedPlayer } from '@/providers/DailyRosterProvider';

interface RosterGridProps {
  /** Players successfully named by the user so far. */
  namedPlayers: NamedPlayer[];
  /** Total number of players on the roster. */
  rosterSize: number;
  /** Whether the game has ended (win or loss). */
  complete: boolean;
  /** Players not named by the user, revealed at game-over. */
  missedPlayers?: NamedPlayer[];
  /** Season label used for the grid aria-label. */
  seasonId: string;
  /** Team name used for the grid aria-label. */
  teamFullName: string;
}

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  reveal: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

const PLACEHOLDER_COUNT = 14;

/**
 * Renders the roster grid with named player cards and unrevealed placeholders.
 * At game-over, missed players are stagger-animated into the remaining slots.
 *
 * @example
 * <RosterGrid
 *   namedPlayers={named}
 *   rosterSize={14}
 *   complete={false}
 *   seasonId="2015-16"
 *   teamFullName="Golden State Warriors"
 * />
 */
export function RosterGrid({
  namedPlayers,
  rosterSize,
  complete,
  missedPlayers = [],
  seasonId,
  teamFullName,
}: RosterGridProps) {
  const prefersReducedMotion = useReducedMotion();
  const totalSlots = rosterSize > 0 ? rosterSize : PLACEHOLDER_COUNT;
  const unrevealedCount = Math.max(0, totalSlots - namedPlayers.length - missedPlayers.length);

  return (
    <div
      role="list"
      aria-label={`${seasonId} ${teamFullName} roster`}
      className="grid grid-cols-2 gap-3 sm:grid-cols-3"
    >
      {/* Named players — animate in as they're guessed */}
      <AnimatePresence>
        {namedPlayers.map((player) => (
          <RosterPlayerCard key={player.playerId} player={player} />
        ))}
      </AnimatePresence>

      {/* Missed players revealed at game-over with stagger */}
      {complete &&
        missedPlayers.map((player, i) =>
          prefersReducedMotion ? (
            <div key={player.playerId}>
              <RosterPlayerCard player={player} missed />
            </div>
          ) : (
            <motion.div
              key={player.playerId}
              variants={itemVariants}
              initial="hidden"
              animate="reveal"
              // Stagger via explicit delay — CSS grid prevents parent-variant staggering
              transition={{ duration: 0.25, delay: 0.1 + i * 0.06 }}
            >
              <RosterPlayerCard player={player} missed />
            </motion.div>
          ),
        )}

      {/* Unrevealed placeholder slots */}
      {!complete &&
        Array.from({ length: unrevealedCount }).map((_, i) => (
          <div
            key={`placeholder-${i}`}
            role="listitem"
            aria-label="Unknown player"
            className="rounded-lg border border-dashed border-border bg-surface p-4 h-20 flex items-center justify-center"
          >
            <HelpCircle className="h-6 w-6 text-text-placeholder" />
          </div>
        ))}
    </div>
  );
}
