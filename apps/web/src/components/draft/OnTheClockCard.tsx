import type { Participant } from '@dribblio/types';
import { TurnTimer } from '@/components/draft/TurnTimer';

interface OnTheClockCardProps {
  /** The participant whose turn it currently is. */
  participant: Participant;
  /** Whether it is the viewing user's own turn. */
  isMyTurn: boolean;
  /** Timer duration in seconds. Omit when there is no active timer. */
  timerDurationSeconds?: number;
  /** Called when the turn timer expires. */
  onTimerExpire?: () => void;
}

/**
 * Highlighted card representing the current active pick slot in DraftTimeline.
 *
 * Displays the participant's name prominently and, when a timer duration is
 * provided, renders the `TurnTimer` countdown ring.
 *
 * @param participant - The participant whose turn it is.
 * @param isMyTurn - Whether it is the viewing user's own turn.
 * @param timerDurationSeconds - Duration for the turn timer, if active.
 * @param onTimerExpire - Called when the timer reaches zero.
 *
 * @example
 * <OnTheClockCard participant={currentParticipant} isMyTurn={isMyTurn} timerDurationSeconds={60} onTimerExpire={handleExpire} />
 */
export function OnTheClockCard({
  participant,
  isMyTurn,
  timerDurationSeconds,
  onTimerExpire,
}: OnTheClockCardProps) {
  return (
    <div className="flex flex-col items-center justify-center w-32 h-full shrink-0 rounded-lg border-2 border-red-600 bg-surface-raised p-3 gap-2 shadow-md overflow-hidden">
      <span className="text-xs font-bold text-red-600 uppercase tracking-wide">On the Clock</span>
      <p className="text-sm font-bold text-center leading-tight truncate w-full text-center">
        {isMyTurn ? 'You!' : participant.name}
      </p>
      {timerDurationSeconds && onTimerExpire && (
        <TurnTimer durationSeconds={timerDurationSeconds} onExpire={onTimerExpire} />
      )}
    </div>
  );
}
