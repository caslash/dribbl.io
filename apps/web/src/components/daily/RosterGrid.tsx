import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { RosterPlayerRow, RosterPlayerRowPlaceholder } from './RosterPlayerRow';
import type { NamedPlayer } from '@/providers/DailyRosterProvider';

interface RosterPlayerListProps {
  /** Players successfully named by the user so far. */
  namedPlayers: NamedPlayer[];
  /** Total number of players on the roster. */
  rosterSize: number;
  /** Whether the game has ended (win or loss). */
  complete: boolean;
  /** Players not named by the user, revealed at game-over. */
  missedPlayers?: NamedPlayer[];
  /** Season label used for the list aria-label. */
  seasonId: string;
  /** Team name used for the list aria-label. */
  teamFullName: string;
}

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  reveal: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

const PLACEHOLDER_COUNT = 14;

/**
 * Renders the roster as a vertical scrollable list with named player rows and
 * unrevealed placeholder rows. At game-over, missed players are stagger-animated
 * into the remaining slots.
 *
 * @example
 * <RosterPlayerList
 *   namedPlayers={named}
 *   rosterSize={14}
 *   complete={false}
 *   seasonId="2015-16"
 *   teamFullName="Golden State Warriors"
 * />
 */
export function RosterPlayerList({
  namedPlayers,
  rosterSize,
  complete,
  missedPlayers = [],
  seasonId,
  teamFullName,
}: RosterPlayerListProps) {
  const prefersReducedMotion = useReducedMotion();
  const totalSlots = rosterSize > 0 ? rosterSize : PLACEHOLDER_COUNT;
  const unrevealedCount = Math.max(0, totalSlots - namedPlayers.length - missedPlayers.length);

  return (
    <div
      role="list"
      aria-label={`${seasonId} ${teamFullName} roster`}
      className="flex flex-col gap-1"
    >
      {/* Named players — animate in as they're guessed */}
      <AnimatePresence>
        {namedPlayers.map((player) => (
          <RosterPlayerRow key={player.playerId} player={player} />
        ))}
      </AnimatePresence>

      {/* Missed players revealed at game-over with stagger */}
      {complete &&
        missedPlayers.map((player, i) =>
          prefersReducedMotion ? (
            <div key={player.playerId}>
              <RosterPlayerRow player={player} missed />
            </div>
          ) : (
            <motion.div
              key={player.playerId}
              variants={itemVariants}
              initial="hidden"
              animate="reveal"
              // Stagger via explicit delay — flex list prevents parent-variant staggering
              transition={{ duration: 0.25, delay: 0.1 + i * 0.06 }}
            >
              <RosterPlayerRow player={player} missed />
            </motion.div>
          ),
        )}

      {/* Unrevealed placeholder slots */}
      {!complete &&
        Array.from({ length: unrevealedCount }).map((_, i) => (
          <RosterPlayerRowPlaceholder key={`placeholder-${i}`} />
        ))}
    </div>
  );
}

// Re-export the old name so any direct (non-barrel) imports don't break during migration.
export { RosterPlayerList as RosterGrid };
