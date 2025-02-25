import usePlayerSearch from '@/hooks/usePlayerSearch';
import { useState } from 'react';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '../ui/command';
import PlayerSearchResult from './playersearchresult';

export default function PlayerSearchBar({
  className,
  onSelect,
}: Readonly<{
  className?: string;
  onSelect?: (id: number) => void;
}>) {
  const [search, setSearch] = useState<string>('');
  const { playerCount, list } = usePlayerSearch();

  return (
    <div className={`flex justify-center ${className}`}>
      <Command
        className="rounded-lg border shadow-md md:min-w-[450px]"
        filter={(value, search) => {
          if (value.toLowerCase().includes(search.toLowerCase())) return 1;
          return 0;
        }}
      >
        <CommandInput
          placeholder={`Search ${playerCount} players...`}
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          {list.isLoading && <CommandEmpty>Loading players...</CommandEmpty>}
          {!list.isLoading && <CommandEmpty>No player found</CommandEmpty>}
          {list.items.map((player) => (
            <CommandItem
              key={player.id}
              onSelect={() => {
                if (onSelect) {
                  onSelect(player.id);
                }
                setSearch('');
              }}
            >
              <PlayerSearchResult player={player} />
            </CommandItem>
          ))}
        </CommandList>
      </Command>
    </div>
  );
}
