import type { PoolEntry } from '@dribblio/types';

interface PickConfirmModalProps {
  /** The entry the user has selected to pick. Null means the modal is hidden. */
  entry: PoolEntry | null;
  /** Called when the user confirms the pick. */
  onConfirm: () => void;
  /** Called when the user cancels. */
  onCancel: () => void;
}

/**
 * Confirmation dialog overlay displayed when a user has selected a pool entry.
 *
 * Renders nothing when `entry` is null. Shows the player headshot, name,
 * subtitle, and stat pills for MVP mode entries. Provides "Confirm Pick" and
 * "Cancel" buttons.
 *
 * @param entry - The selected pool entry, or null to hide the modal.
 * @param onConfirm - Callback fired when the user confirms.
 * @param onCancel - Callback fired when the user cancels.
 *
 * @example
 * <PickConfirmModal entry={selectedEntry} onConfirm={handleConfirm} onCancel={() => setSelectedEntry(null)} />
 */
export function PickConfirmModal({ entry, onConfirm, onCancel }: PickConfirmModalProps) {
  if (!entry) return null;

  const subtitle =
    entry.draftMode === 'mvp'
      ? entry.season
      : `${entry.franchiseName} (${entry.franchiseAbbr})`;

  return (
    <div
      className="absolute inset-0 z-40 flex items-center justify-center bg-black/60"
      onClick={onCancel}
    >
      <div
        className="bg-surface-raised border border-primary-border rounded-xl shadow-xl p-6 flex flex-col items-center gap-4 w-72"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-sm font-bold text-text-muted uppercase tracking-wide">Confirm Pick</p>

        <img
          src={`https://cdn.nba.com/headshots/nba/latest/260x190/${entry.playerId}.png`}
          alt={entry.playerName}
          width={130}
          height={95}
          className="object-cover rounded"
        />

        <div className="text-center">
          <p className="text-lg font-bold leading-tight">{entry.playerName}</p>
          <p className="text-sm text-text-muted">{subtitle}</p>
        </div>

        {entry.draftMode === 'mvp' && (
          <div className="flex gap-3">
            <ModalStatPill label="PTS" value={entry.ptsPg} />
            <ModalStatPill label="AST" value={entry.astPg} />
            <ModalStatPill label="REB" value={entry.rebPg} />
          </div>
        )}

        <div className="flex gap-3 w-full">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-lg border border-primary-border bg-surface-warm px-4 py-2 text-sm font-medium hover:bg-primary-border/20 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-red-600 text-white px-4 py-2 text-sm font-bold hover:bg-red-700 transition-colors"
          >
            Confirm Pick
          </button>
        </div>
      </div>
    </div>
  );
}

interface ModalStatPillProps {
  label: string;
  value: number | null;
}

function ModalStatPill({ label, value }: ModalStatPillProps) {
  return (
    <div className="flex flex-col items-center rounded-lg bg-primary-border/20 px-3 py-1.5 min-w-[48px]">
      <span className="text-xs text-text-muted">{label}</span>
      <span className="text-base font-bold">
        {value != null ? Number(value).toFixed(1) : '-'}
      </span>
    </div>
  );
}
