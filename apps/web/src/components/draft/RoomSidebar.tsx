import { useDraft } from '@/hooks/useDraft';
import { ParticipantList } from '@/components/draft/ParticipantList';

/**
 * Persistent left sidebar shown in all draft phases except 'entrance'.
 *
 * Displays the room code prominently and renders the participant list below it.
 * Consumes context directly via `useDraft`.
 *
 * @example
 * {phase !== 'entrance' && <RoomSidebar />}
 */
export function RoomSidebar() {
  const { state } = useDraft();
  const { roomId, participants } = state;

  const organizerId = participants.find((p) => p.isOrganizer)?.participantId ?? '';

  return (
    <aside className="w-56 shrink-0 border-r border-primary-border flex flex-col gap-4 p-4">
      {roomId && (
        <div>
          <p className="text-xs text-text-muted uppercase tracking-wide mb-1">Room Code</p>
          <p className="font-mono font-black text-2xl tracking-widest text-text-primary">
            {roomId}
          </p>
        </div>
      )}
      <div>
        <p className="text-xs text-text-muted uppercase tracking-wide mb-2">Players</p>
        <ParticipantList participants={participants} organizerId={organizerId} />
      </div>
    </aside>
  );
}
