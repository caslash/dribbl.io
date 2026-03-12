import { useState } from 'react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useCareerPath } from '@/hooks/useCareerPath';

interface DifficultyOption {
  key: string;
  label: string;
  description: string;
}

const DIFFICULTY_OPTIONS: DifficultyOption[] = [
  {
    key: 'firstAllNBA',
    label: 'First Team All-NBA',
    description: 'Players who earned a First Team All-NBA selection',
  },
  {
    key: 'allNBA',
    label: 'All-NBA',
    description: 'Every player to appear on any All-NBA team',
  },
  {
    key: 'greatest75',
    label: 'Top 75',
    description: "NBA's official Greatest 75 players",
  },
  {
    key: 'allPlayers',
    label: 'All Players',
    description: 'Every. Single. Player. Ever.',
  },
];

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
  const [selectedLives, setSelectedLives] = useState<number | undefined>(
    undefined,
  );

  const handleStart = () => {
    saveConfig({
      gameDifficulty: selectedDifficulty,
      lives: selectedLives,
    });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-4xl font-bold text-navy-900 dark:text-cream-100">
          Career Path
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Guess the player from their NBA career team history.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Difficulty
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {DIFFICULTY_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setSelectedDifficulty(opt.key)}
                className={`rounded-lg border p-4 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy-600 ${
                  selectedDifficulty === opt.key
                    ? 'border-burgundy-600 bg-burgundy-600/10 dark:border-burgundy-500 dark:bg-burgundy-500/10'
                    : 'border-cream-300 bg-cream-50 hover:border-navy-700 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-500'
                }`}
              >
                <div className="font-semibold text-navy-900 dark:text-cream-100">
                  {opt.label}
                </div>
                <div className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                  {opt.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Lives
          </h2>
          <div className="flex flex-wrap gap-2">
            {LIVES_OPTIONS.map((opt) => (
              <button
                key={String(opt.value)}
                onClick={() => setSelectedLives(opt.value)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy-600 ${
                  selectedLives === opt.value
                    ? 'border-burgundy-600 bg-burgundy-600 text-cream-50 dark:border-burgundy-500 dark:bg-burgundy-500'
                    : 'border-cream-300 text-navy-800 hover:border-navy-700 dark:border-slate-600 dark:text-cream-200 dark:hover:border-slate-400'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <Card className="bg-cream-100 dark:bg-slate-900">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            <p className="font-medium text-navy-800 dark:text-cream-200">
              How to play
            </p>
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

        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={handleStart}
        >
          Start Game
        </Button>
      </div>
    </div>
  );
}
