import type { Participant } from '@dribblio/types';

interface DraftPickCardProps {
  /** The NBA player ID used to construct the headshot URL. */
  playerId: number;
  /** The player's display name. */
  playerName: string;
  /** The participant who made this pick. */
  participant: Participant | undefined;
  /** Display label, e.g. "R1 P3". */
  label: string;
}

/**
 * Displays a completed draft pick in the DraftTimeline.
 *
 * Shows the pick label, player headshot, player name, and the name of the
 * participant who made the pick.
 *
 * @param pick - The completed pick record.
 * @param playerId - NBA player ID for the headshot image.
 * @param playerName - The display name for the picked player.
 * @param participant - The participant who made the pick.
 * @param label - Round/pick label, e.g. "R1 P3".
 *
 * @example
 * <DraftPickCard pick={pick} playerId={2544} playerName="LeBron James" participant={p} label="R1 P1" />
 */
export function DraftPickCard({ playerId, playerName, participant, label }: DraftPickCardProps) {
  return (
    <div className="flex flex-col items-center w-28 shrink-0 rounded-lg border border-primary-border bg-surface-raised p-2 gap-1">
      <span className="text-xs text-text-muted font-mono">{label}</span>
      <img
        src={`https://cdn.nba.com/headshots/nba/latest/260x190/${playerId}.png`}
        alt={playerName}
        width={64}
        height={47}
        className="object-cover rounded"
      />
      <p className="text-xs font-semibold text-center leading-tight truncate w-full">
        {playerName}
      </p>
      <p className="text-xs text-text-muted text-center truncate w-full">
        {participant?.name ?? '?'}
      </p>
    </div>
  );
}
