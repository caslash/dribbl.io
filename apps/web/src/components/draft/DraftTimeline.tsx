import { DraftPickCard } from '@/components/draft/DraftPickCard';
import { OnTheClockCard } from '@/components/draft/OnTheClockCard';
import { UpcomingPickCard } from '@/components/draft/UpcomingPickCard';
import type { Participant, PickRecord, PoolEntry } from '@dribblio/types';
import { useEffect, useRef } from 'react';

interface DraftTimelineProps {
  /** Pre-expanded ordered array of participantIds. */
  turnOrder: string[];
  /** The current index into turnOrder. */
  currentTurnIndex: number;
  /** All completed picks in order. */
  pickHistory: PickRecord[];
  /** All participants in the room. */
  participants: Participant[];
  /** The full pool, used to resolve player details for completed picks. */
  pool: PoolEntry[];
  /** Whether it is the current user's turn. */
  isMyTurn: boolean;
  /** Timer duration in seconds for the active turn, if applicable. */
  timerDurationSeconds?: number;
  /** Called when the turn timer expires. */
  onTimerExpire?: () => void;
}

/**
 * Horizontal scrollable strip displaying the full draft order.
 *
 * Renders each slot in turnOrder as one of:
 * - `DraftPickCard` for past picks (i < currentTurnIndex)
 * - `OnTheClockCard` for the active turn (i === currentTurnIndex)
 * - `UpcomingPickCard` for future slots (i > currentTurnIndex)
 *
 * Auto-scrolls the on-the-clock card into view whenever currentTurnIndex changes.
 *
 * @param turnOrder - The pre-expanded ordered array of participantIds.
 * @param currentTurnIndex - Current position in turnOrder.
 * @param pickHistory - All completed picks.
 * @param participants - All room participants.
 * @param pool - The draft pool, used to resolve player details.
 * @param isMyTurn - Whether it is the current user's turn.
 * @param timerDurationSeconds - Active timer duration in seconds.
 * @param onTimerExpire - Called when the timer expires.
 *
 * @example
 * <DraftTimeline
 *   turnOrder={state.turnOrder}
 *   currentTurnIndex={state.currentTurnIndex}
 *   pickHistory={state.pickHistory}
 *   participants={state.participants}
 *   pool={state.pool}
 *   isMyTurn={isMyTurn}
 * />
 */
export function DraftTimeline({
  turnOrder,
  currentTurnIndex,
  pickHistory,
  participants,
  pool,
  isMyTurn,
  timerDurationSeconds,
  onTimerExpire,
}: DraftTimelineProps) {
  const activeRef = useRef<HTMLDivElement>(null);
  const participantsCount = participants.length || 1;

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [currentTurnIndex]);

  return (
    <div className="flex gap-2 overflow-x-auto py-3 px-2 shrink-0" style={{ height: '180px' }}>
      {turnOrder.map((participantId, i) => {
        const participant = participants.find((p) => p.participantId === participantId);
        const round = Math.floor(i / participantsCount) + 1;
        const pickNum = (i % participantsCount) + 1;
        const label = `R${round} P${pickNum}`;

        if (i < currentTurnIndex) {
          const pick = pickHistory.find((p) => p.round === round && p.pickNumber === pickNum);
          const entry = pick ? pool.find((e) => e.entryId === pick.entryId) : undefined;
          return (
            <DraftPickCard
              key={i}
              playerId={entry?.playerId ?? 0}
              playerName={entry?.playerName ?? '?'}
              participant={participant}
              label={label}
            />
          );
        }

        if (i === currentTurnIndex) {
          return participant ? (
            <div key={i} ref={activeRef} className="h-full">
              <OnTheClockCard
                participant={participant}
                isMyTurn={isMyTurn}
                timerDurationSeconds={timerDurationSeconds}
                onTimerExpire={onTimerExpire}
              />
            </div>
          ) : null;
        }

        return (
          <UpcomingPickCard
            key={i}
            participantName={participant?.name ?? '?'}
            index={i}
            participantsCount={participantsCount}
          />
        );
      })}
    </div>
  );
}
