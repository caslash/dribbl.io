import { motion, useReducedMotion } from 'framer-motion';
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
 * Renders the roster as a slot-based vertical list. Each slot maps to a
 * position in the ppg-sorted roster. Named players fill their correct slot as
 * they are revealed; at game-over, missed players stagger-animate in.
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

  // Index-keyed maps for O(1) slot lookup
  const namedByIndex = new Map(namedPlayers.map((p) => [p.index, p]));
  const missedByIndex = new Map(missedPlayers.map((p) => [p.index, p]));

  // Pre-compute stagger order for missed players in slot order
  const missedStagger = new Map<number, number>();
  let staggerCount = 0;
  for (let i = 0; i < totalSlots; i++) {
    if (missedByIndex.has(i)) missedStagger.set(i, staggerCount++);
  }

  return (
    <div
      role="list"
      aria-label={`${seasonId} ${teamFullName} roster`}
      className="flex flex-col gap-1"
    >
      {Array.from({ length: totalSlots }).map((_, slotIndex) => {
        const named = namedByIndex.get(slotIndex);
        if (named) {
          return <RosterPlayerRow key={named.playerId} player={named} />;
        }

        const missed = missedByIndex.get(slotIndex);
        if (complete && missed) {
          const delay = 0.1 + (missedStagger.get(slotIndex) ?? 0) * 0.06;
          return prefersReducedMotion ? (
            <div key={missed.playerId}>
              <RosterPlayerRow player={missed} missed />
            </div>
          ) : (
            <motion.div
              key={missed.playerId}
              variants={itemVariants}
              initial="hidden"
              animate="reveal"
              transition={{ duration: 0.25, delay }}
            >
              <RosterPlayerRow player={missed} missed />
            </motion.div>
          );
        }

        return <RosterPlayerRowPlaceholder key={`placeholder-${slotIndex}`} />;
      })}
    </div>
  );
}

// Re-export the old name so any direct (non-barrel) imports don't break during migration.
export { RosterPlayerList as RosterGrid };
