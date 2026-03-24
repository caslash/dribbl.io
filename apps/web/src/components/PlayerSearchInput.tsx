import { Command } from 'cmdk';
import { Loader2 } from 'lucide-react';
import { forwardRef, useCallback, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { BACKEND_URL } from '@/config';

/** Lightweight player shape returned by the search API. */
interface PlayerSearchResult {
  playerId: number;
  fullName: string;
}

interface PlayerSearchInputProps {
  /** Called when the user selects a player from the dropdown. */
  onSelect: (playerId: number, fullName: string) => void;
  /** Called when Enter is pressed after a player has been selected. */
  onSubmit?: () => void;
  /** Disables the input and dropdown. */
  disabled?: boolean;
  /** Placeholder text for the input. */
  placeholder?: string;
}

/**
 * Autocomplete player search input backed by `GET /api/players?search={query}`.
 * Debounced at 400ms to avoid thrashing the API on every keystroke.
 *
 * @example
 * <PlayerSearchInput
 *   onSelect={(id, name) => handleGuess(id)}
 *   placeholder="Search for a player..."
 * />
 */
export const PlayerSearchInput = forwardRef<HTMLInputElement, PlayerSearchInputProps>(
  function PlayerSearchInput({
  onSelect,
  onSubmit,
  disabled = false,
  placeholder = 'Search for a player...',
}, ref) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PlayerSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Tracks whether the current query reflects a confirmed player selection
  const hasSelectionRef = useRef(false);

  const fetchPlayers = useCallback(async (search: string) => {
    if (!search.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/players?search=${encodeURIComponent(search)}`,
      );
      if (!res.ok) throw new Error('Search failed');
      const data = (await res.json()) as PlayerSearchResult[];
      setResults(data);
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const spaceBelow = window.innerHeight - rect.bottom;
        setOpenUpward(spaceBelow < 240 && rect.top > spaceBelow);
      }
      setOpen(true);
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (value: string) => {
    hasSelectionRef.current = false;
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      void fetchPlayers(value);
    }, 400);
  };

  const handleSelect = (player: PlayerSearchResult) => {
    hasSelectionRef.current = true;
    setQuery(player.fullName);
    setResults([]);
    setOpen(false);
    onSelect(player.playerId, player.fullName);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !open && hasSelectionRef.current) {
      onSubmit?.();
    }
  };

  return (
    <Command shouldFilter={false} className="relative" ref={containerRef}>
      <div className="relative">
        <Command.Input
          ref={ref}
          value={query}
          onValueChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full rounded-md border border-border bg-surface-raised px-3 py-2 text-text-primary placeholder:text-text-placeholder focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/30 disabled:cursor-not-allowed disabled:opacity-50"
        />
        {isLoading && (
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <Loader2 className="h-4 w-4 animate-spin text-text-placeholder" />
          </div>
        )}
      </div>

      {open && (
        <Command.List className={`absolute z-10 max-h-60 w-full overflow-auto rounded-md border border-border bg-surface-raised py-1 shadow-lg focus:outline-none ${openUpward ? 'bottom-full mb-1' : 'top-full mt-1'}`}>
          <Command.Empty className="px-3 py-2 text-sm text-text-muted">
            No players found
          </Command.Empty>
          {results.map((player) => (
            <Command.Item
              key={player.playerId}
              value={String(player.playerId)}
              onSelect={() => handleSelect(player)}
              className="cursor-pointer px-3 py-2 text-text-primary data-[selected=true]:bg-blue-800 data-[selected=true]:text-white"
            >
              {player.fullName}
            </Command.Item>
          ))}
        </Command.List>
      )}
    </Command>
  );
});

