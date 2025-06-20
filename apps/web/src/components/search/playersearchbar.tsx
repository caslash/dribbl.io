import PlayerSearchResult from '@/components/search/playersearchresult';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { nba } from '@dribblio/database';
import { useEffect, useState } from 'react';

export default function PlayerSearchBar({
  className,
  playerList,
  onSelect,
}: Readonly<{
  className?: string;
  playerList?: nba.Player[];
  onSelect?: (id: number) => void;
}>) {
  const [search, setSearch] = useState<string>('');
  const [players, setPlayers] = useState<nba.Player[]>([]);

  useEffect(() => {
    if (!playerList) {
      fetch('/api/players')
        .then((res) => res.json())
        .then((list: nba.Player[]) =>
          setPlayers(list.sort((a, b) => a.last_name!.localeCompare(b.last_name!))),
        );
    } else {
      setPlayers(playerList);
    }
  }, [playerList]);

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
          placeholder={`Search ${players?.length} players...`}
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          <CommandEmpty>No player found</CommandEmpty>
          {players?.map((player) => (
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
