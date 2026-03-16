import { Button, Card, Input } from '@/components';
import type { DraftMode, DraftOrder, DraftRoomConfig } from '@/components/draft/types';
import { useDraft } from '@/hooks/useDraft';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';
import { useForm, useWatch } from 'react-hook-form';

const configSchema = Joi.object({
  draftMode: Joi.string().valid('mvp', 'franchise').required(),
  draftOrder: Joi.string().valid('snake', 'linear').required(),
  maxRounds: Joi.number().integer().min(1).max(10).required(),
  timerEnabled: Joi.boolean().required(),
  turnDuration: Joi.number().integer().min(15).max(120).required(),
});

interface ConfigFormValues {
  draftMode: DraftMode;
  draftOrder: DraftOrder;
  maxRounds: number;
  timerEnabled: boolean;
  turnDuration: number;
}

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

  const { register, handleSubmit, setValue, control, formState: { errors } } = useForm<ConfigFormValues>({
    resolver: joiResolver(configSchema),
    defaultValues: {
      draftMode: 'mvp',
      draftOrder: 'snake',
      maxRounds: 5,
      timerEnabled: false,
      turnDuration: 60,
    },
  });

  const draftMode = useWatch({ control, name: 'draftMode' });
  const draftOrder = useWatch({ control, name: 'draftOrder' });
  const timerEnabled = useWatch({ control, name: 'timerEnabled' });

  function onSubmit(values: ConfigFormValues) {
    const config: DraftRoomConfig = {
      draftMode: values.draftMode,
      draftOrder: values.draftOrder,
      maxRounds: values.maxRounds,
      ...(values.timerEnabled ? { turnDuration: values.turnDuration } : {}),
    };
    saveConfig(config);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full max-w-lg">
      {/* Draft mode */}
      <div className="flex flex-col gap-2">
        <label className="text-base font-semibold">Draft Mode</label>
        <div className="grid grid-cols-2 gap-3">
          <ModeCard
            active={draftMode === 'mvp'}
            onClick={() => setValue('draftMode', 'mvp')}
            title="MVP Mode"
            description="Every MVP season in the pool. Picking a player removes all their other MVP seasons."
          />
          <ModeCard
            active={draftMode === 'franchise'}
            onClick={() => setValue('draftMode', 'franchise')}
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
            onClick={() => setValue('draftOrder', 'snake')}
            label="Snake"
          />
          <OrderToggle
            active={draftOrder === 'linear'}
            onClick={() => setValue('draftOrder', 'linear')}
            label="Linear"
          />
        </div>
        <p className="text-xs text-text-muted">
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
          className="w-24"
          {...register('maxRounds', { valueAsNumber: true })}
        />
        {errors.maxRounds && (
          <p className="text-xs text-red-500">{errors.maxRounds.message}</p>
        )}
      </div>

      {/* Turn timer */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <input
            id="timer-toggle"
            type="checkbox"
            className="w-4 h-4 cursor-pointer"
            {...register('timerEnabled')}
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
              className="w-24"
              {...register('turnDuration', { valueAsNumber: true })}
            />
            {errors.turnDuration && (
              <p className="text-xs text-red-500">{errors.turnDuration.message}</p>
            )}
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
      className={`cursor-pointer transition-colors border-2 ${active ? 'border-red-600 bg-red-600/5' : 'border-primary-border hover:border-red-600'}`}
    >
      <p className="text-sm font-semibold mb-1">{title}</p>
      <p className="text-xs text-text-muted leading-snug">{description}</p>
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
          ? 'bg-red-600 text-white border-red-600'
          : 'bg-transparent text-text-secondary border-primary-border hover:bg-surface-warm'
      }`}
    >
      {label}
    </button>
  );
}
