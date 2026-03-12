import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';
import { Loader2 } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

/** Lightweight player shape returned by the search API. */
interface PlayerSearchResult {
  playerId: number;
  fullName: string;
}

interface PlayerSearchInputProps {
  /** Called when the user selects a player from the dropdown. */
  onSelect: (playerId: number, fullName: string) => void;
  /** Disables the input and dropdown. */
  disabled?: boolean;
  /** Placeholder text for the input. */
  placeholder?: string;
}

/**
 * Autocomplete player search input backed by `GET /api/players?search={query}`.
 * Debounced at 300ms to avoid thrashing the API on every keystroke.
 *
 * @example
 * <PlayerSearchInput
 *   onSelect={(id, name) => handleGuess(id)}
 *   placeholder="Search for a player..."
 * />
 */
export function PlayerSearchInput({
  onSelect,
  disabled = false,
  placeholder = 'Search for a player...',
}: PlayerSearchInputProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PlayerSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState<PlayerSearchResult | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchPlayers = useCallback(async (search: string) => {
    if (!search.trim()) {
      setResults([]);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/players?search=${encodeURIComponent(search)}`,
      );
      if (!res.ok) throw new Error('Search failed');
      const data = (await res.json()) as PlayerSearchResult[];
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);

    // Socket.io batches rapid updates — debounce to avoid thrashing state
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      void fetchPlayers(value);
    }, 300);
  };

  const handleSelect = (player: PlayerSearchResult | null) => {
    if (!player) return;
    setSelected(player);
    setQuery(player.fullName);
    setResults([]);
    onSelect(player.playerId, player.fullName);
  };

  return (
    <Combobox value={selected} onChange={handleSelect} disabled={disabled}>
      <div className="relative">
        <div className="relative">
          <ComboboxInput
            className="w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-navy-900 placeholder:text-slate-400 focus:border-burgundy-600 focus:outline-none focus:ring-2 focus:ring-burgundy-600/30 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-cream-100 dark:placeholder:text-slate-500"
            displayValue={(player: PlayerSearchResult | null) =>
              player?.fullName ?? ''
            }
            onChange={handleInputChange}
            value={query}
            placeholder={placeholder}
            autoComplete="off"
          />
          {isLoading && (
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
            </div>
          )}
        </div>

        {results.length > 0 && (
          <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-cream-200 bg-cream-50 py-1 shadow-lg focus:outline-none dark:border-slate-700 dark:bg-slate-800">
            {results.map((player) => (
              <ComboboxOption
                key={player.playerId}
                value={player}
                className="cursor-pointer px-3 py-2 text-navy-900 data-focus:bg-navy-800 data-focus:text-cream-50 dark:text-cream-100 dark:data-focus:bg-cream-200 dark:data-focus:text-navy-900"
              >
                {player.fullName}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        )}

        {!isLoading && query.trim().length > 0 && results.length === 0 && (
          <div className="absolute z-10 mt-1 w-full rounded-md border border-cream-200 bg-cream-50 px-3 py-2 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
            No players found
          </div>
        )}
      </div>
    </Combobox>
  );
}
