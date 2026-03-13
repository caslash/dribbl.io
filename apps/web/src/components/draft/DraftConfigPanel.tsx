import { Button, Card, Input } from '@/components';
import type { DraftMode, DraftOrder, DraftRoomConfig } from '@/components/draft/types';
import { useDraft } from '@/hooks/useDraft';
import { useState } from 'react';

/**
 * Configuration panel for the room organizer to set up the draft before it starts.
 *
 * Lets the organizer choose draft mode, draft order, max rounds, and an optional turn timer.
 * Submits via `saveConfig` from the draft context.
 *
 * Only the organizer should render this component.
 *
 * @example
 * {state.isOrganizer && <DraftConfigPanel />}
 */
export function DraftConfigPanel() {
  const { saveConfig } = useDraft();

  const [draftMode, setDraftMode] = useState<DraftMode>('mvp');
  const [draftOrder, setDraftOrder] = useState<DraftOrder>('snake');
  const [maxRounds, setMaxRounds] = useState(5);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [turnDuration, setTurnDuration] = useState(60);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const config: DraftRoomConfig = {
      draftMode,
      draftOrder,
      maxRounds,
      ...(timerEnabled ? { turnDuration } : {}),
    };
    saveConfig(config);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-lg">
      {/* Draft mode */}
      <div className="flex flex-col gap-2">
        <label className="text-base font-semibold">Draft Mode</label>
        <div className="grid grid-cols-2 gap-3">
          <ModeCard
            active={draftMode === 'mvp'}
            onClick={() => setDraftMode('mvp')}
            title="MVP Mode"
            description="Every MVP season in the pool. Picking a player removes all their other MVP seasons."
          />
          <ModeCard
            active={draftMode === 'franchise'}
            onClick={() => setDraftMode('franchise')}
            title="Franchise Mode"
            description="One player per franchise. Picking a player removes that franchise from the pool."
          />
        </div>
      </div>

      {/* Draft order */}
      <div className="flex flex-col gap-2">
        <label className="text-base font-semibold">Draft Order</label>
        <div className="flex gap-2">
          <OrderToggle
            active={draftOrder === 'snake'}
            onClick={() => setDraftOrder('snake')}
            label="Snake"
          />
          <OrderToggle
            active={draftOrder === 'linear'}
            onClick={() => setDraftOrder('linear')}
            label="Linear"
          />
        </div>
        <p className="text-xs text-navy-500 dark:text-cream-300">
          {draftOrder === 'snake'
            ? 'Round order reverses each round (1→N, N→1, …)'
            : 'Same pick order every round (1→N, 1→N, …)'}
        </p>
      </div>

      {/* Max rounds */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="max-rounds" className="text-base font-semibold">
          Max Rounds
        </label>
        <Input
          id="max-rounds"
          type="number"
          min={1}
          max={10}
          value={maxRounds}
          onChange={(e) => setMaxRounds(Math.min(10, Math.max(1, Number(e.target.value))))}
          className="w-24"
        />
      </div>

      {/* Turn timer */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <input
            id="timer-toggle"
            type="checkbox"
            checked={timerEnabled}
            onChange={(e) => setTimerEnabled(e.target.checked)}
            className="w-4 h-4 cursor-pointer"
          />
          <label htmlFor="timer-toggle" className="text-base font-semibold cursor-pointer">
            Turn Timer
          </label>
        </div>
        {timerEnabled && (
          <div className="flex flex-col gap-1.5 pl-1">
            <label htmlFor="turn-duration" className="text-sm font-medium">
              Seconds per turn (15–120)
            </label>
            <Input
              id="turn-duration"
              type="number"
              min={15}
              max={120}
              value={turnDuration}
              onChange={(e) => setTurnDuration(Math.min(120, Math.max(15, Number(e.target.value))))}
              className="w-24"
            />
          </div>
        )}
      </div>

      <Button type="submit" className="self-start">
        Save Config
      </Button>
    </form>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface ModeCardProps {
  active: boolean;
  onClick: () => void;
  title: string;
  description: string;
}

function ModeCard({ active, onClick, title, description }: ModeCardProps) {
  return (
    <Card
      onClick={onClick}
      className={`cursor-pointer transition-colors border-2 ${active ? 'border-burgundy-600 bg-burgundy-600/5' : 'border-navy-200 dark:border-navy-700 hover:border-burgundy-600'}`}
    >
      <p className="text-sm font-semibold mb-1">{title}</p>
      <p className="text-xs text-navy-500 dark:text-cream-300 leading-snug">{description}</p>
    </Card>
  );
}

interface OrderToggleProps {
  active: boolean;
  onClick: () => void;
  label: string;
}

function OrderToggle({ active, onClick, label }: OrderToggleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors ${
        active
          ? 'bg-burgundy-600 text-cream-50 border-burgundy-600'
          : 'bg-transparent text-navy-800 dark:text-cream-200 border-navy-300 dark:border-navy-600 hover:bg-navy-100 dark:hover:bg-navy-800'
      }`}
    >
      {label}
    </button>
  );
}
