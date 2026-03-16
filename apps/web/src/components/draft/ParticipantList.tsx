import type { Participant } from '@dribblio/types';
import { useDraft } from '@/hooks/useDraft';
import { Crown, User } from 'lucide-react';

interface ParticipantListProps {
  participants: Participant[];
  organizerId: string;
}

/**
 * Vertical list of all participants currently in the draft room.
 *
 * Highlights the current user with "(You)" and marks the organizer with a crown icon.
 *
 * @param participants - All participants in the room.
 * @param organizerId - The participantId of the room organizer.
 *
 * @example
 * <ParticipantList participants={state.participants} organizerId={organizerId} />
 */
export function ParticipantList({ participants, organizerId }: ParticipantListProps) {
  const { state } = useDraft();

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted-foreground">
        {participants.length} participant{participants.length !== 1 ? 's' : ''}
      </p>
      <ul className="flex flex-col gap-1">
        {participants.map((p) => (
          <li
            key={p.participantId}
            className="flex items-center gap-2 rounded-md px-3 py-2 bg-secondary text-secondary-foreground"
          >
            <User size={16} className="shrink-0 text-muted-foreground" />
            <span className="flex-1 text-sm font-medium truncate">{p.name}</span>
            {p.participantId === state.myParticipantId && (
              <span className="text-xs text-muted-foreground shrink-0">(You)</span>
            )}
            {p.participantId === organizerId && (
              <Crown size={14} className="shrink-0 text-yellow-500" aria-label="Organizer" />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
