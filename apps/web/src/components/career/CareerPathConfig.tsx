import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useCareerPath } from '@/hooks/useCareerPath';
import { GameDifficulties } from '@dribblio/types';
import { useState } from 'react';

const LIVES_OPTIONS = [
  { label: 'Infinite', value: undefined },
  { label: '3 Lives', value: 3 },
  { label: '5 Lives', value: 5 },
  { label: '10 Lives', value: 10 },
] as const;

/**
 * Config screen shown before the game starts. The user selects a difficulty
 * tier and a lives setting, then clicks Start to begin.
 *
 * @example
 * <CareerPathConfig />
 */
export function CareerPathConfig() {
  const { saveConfig } = useCareerPath();
  const [selectedDifficulty, setSelectedDifficulty] = useState('greatest75');
  const [selectedLives, setSelectedLives] = useState<number | undefined>(undefined);

  const handleStart = () => {
    saveConfig({
      gameDifficulty: selectedDifficulty,
      lives: selectedLives,
    });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-4xl font-bold text-primary-text">Career Path</h1>
        <p className="mt-2 text-text-muted">Guess the player from their NBA career team history.</p>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
            Difficulty
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {GameDifficulties.allModes.map((opt) => (
              <button
                key={opt.name}
                onClick={() => setSelectedDifficulty(opt.name)}
                className={`rounded-lg border p-4 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 ${
                  selectedDifficulty === opt.name
                    ? 'border-red-600 bg-red-600/10'
                    : 'border-border bg-surface-raised hover:border-text-secondary'
                }`}
              >
                <div className="font-semibold text-text-primary">{opt.display_name}</div>
                <div className="mt-0.5 text-sm text-text-muted">{opt.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
            Lives
          </h2>
          <div className="flex flex-wrap gap-2">
            {LIVES_OPTIONS.map((opt) => (
              <button
                key={String(opt.value)}
                onClick={() => setSelectedLives(opt.value)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 ${
                  selectedLives === opt.value
                    ? 'border-red-600 bg-red-600 text-white'
                    : 'border-border text-text-secondary hover:border-text-secondary'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <Card className="bg-surface-warm">
          <div className="text-sm text-text-muted">
            <p className="font-medium text-text-secondary">How to play</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>A sequence of team abbreviations will appear on screen.</li>
              <li>Type a player's name in the search box to make your guess.</li>
              <li>
                {selectedLives === undefined
                  ? 'Infinite mode: wrong guesses reset your score to 0.'
                  : `You have ${selectedLives} lives. Each wrong guess or skip costs 1 life.`}
              </li>
            </ul>
          </div>
        </Card>

        <Button variant="primary" size="lg" className="w-full" onClick={handleStart}>
          Start Game
        </Button>
      </div>
    </div>
  );
}
