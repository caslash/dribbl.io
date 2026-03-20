interface UpcomingPickCardProps {
  /** The name of the participant who will pick at this slot. */
  participantName: string;
  /** The absolute index in the turnOrder array. */
  index: number;
  /** Total number of participants, used to compute the round number. */
  participantsCount: number;
}

/**
 * Dimmed card representing a future pick slot in DraftTimeline.
 *
 * Displays the round number and the participant's name in a muted style to
 * indicate it has not happened yet.
 *
 * @param participantName - Name of the participant scheduled for this slot.
 * @param index - Position in the full turnOrder array (0-based).
 * @param participantsCount - Total number of participants for round calculation.
 *
 * @example
 * <UpcomingPickCard participantName="Alice" index={4} participantsCount={4} />
 */
export function UpcomingPickCard({ participantName, index, participantsCount }: UpcomingPickCardProps) {
  const round = Math.floor(index / participantsCount) + 1;

  return (
    <div className="flex flex-col items-center w-28 shrink-0 rounded-lg border border-primary-border bg-surface-warm opacity-50 p-2 gap-1">
      <span className="text-xs text-text-muted font-mono">R{round}</span>
      <div className="w-16 h-12 rounded bg-primary-border/30 flex items-center justify-center">
        <span className="text-text-muted text-lg">?</span>
      </div>
      <p className="text-xs text-text-muted text-center truncate w-full">{participantName}</p>
    </div>
  );
}
