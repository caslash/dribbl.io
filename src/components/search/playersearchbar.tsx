import { getPlayers } from '@/server/actions';
import { Player } from '@prisma/client';
import { useEffect, useState } from 'react';
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
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    getPlayers().then((list) =>
      setPlayers(list.sort((a, b) => a.last_name!.localeCompare(b.last_name!))),
    );
  }, []);

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
          placeholder={`Search ${players.length} players...`}
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          <CommandEmpty>No player found</CommandEmpty>
          {players.map((player) => (
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
