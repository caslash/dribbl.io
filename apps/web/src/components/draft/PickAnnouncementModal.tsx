import type { PickRecord, PoolEntry, Participant } from '@dribblio/types';
import { useEffect } from 'react';

interface PickAnnouncementModalProps {
  /** The pick to announce. Null means the modal is hidden. */
  pick: PickRecord | null;
  /** The pool entry for this pick, used to display the player details. */
  entry: PoolEntry | undefined;
  /** The participant who made the pick. */
  participant: Participant | undefined;
  /** Called after the auto-dismiss timeout elapses. */
  onDismiss: () => void;
}

/**
 * Dramatic "THE PICK IS IN" announcement overlay shown after each pick.
 *
 * Renders nothing when `pick` is null. Automatically calls `onDismiss` after
 * 2500ms. Uses `absolute inset-0 z-50` so it overlays DraftBoard's content
 * while keeping the sidebar visible.
 *
 * @param pick - The pick to announce, or null to hide.
 * @param entry - The pool entry for the picked player.
 * @param participant - The participant who made the pick.
 * @param onDismiss - Called 2500ms after `pick` becomes non-null.
 *
 * @example
 * <PickAnnouncementModal pick={announcedPick} entry={poolEntry} participant={p} onDismiss={() => setAnnouncedPick(null)} />
 */
export function PickAnnouncementModal({
  pick,
  entry,
  participant,
  onDismiss,
}: PickAnnouncementModalProps) {
  useEffect(() => {
    if (!pick) return;
    const id = setTimeout(onDismiss, 2500);
    return () => clearTimeout(id);
  }, [pick, onDismiss]);

  if (!pick || !entry) return null;

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/75"
      onClick={onDismiss}
    >
      <div className="flex flex-col items-center gap-4 text-center px-8">
        <p className="text-3xl font-black text-white uppercase tracking-widest drop-shadow-lg">
          The Pick Is In
        </p>
        <img
          src={`https://cdn.nba.com/headshots/nba/latest/260x190/${entry.playerId}.png`}
          alt={entry.playerName}
          width={130}
          height={95}
          className="object-cover rounded drop-shadow-xl"
        />
        <div>
          <p className="text-xl font-bold text-white">{entry.playerName}</p>
          <p className="text-sm text-white/70 mt-1">
            Picked by{' '}
            <span className="font-semibold text-white">{participant?.name ?? '?'}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
