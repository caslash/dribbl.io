import usePlayerSearch from '@/hooks/usePlayerSearch';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '../ui/command';
import PlayerSearchResult from './playersearchresult';

export default function PlayerSearchBar({
  className,
  onSelect,
}: Readonly<{
  className?: string;
  onSelect?: (id: number) => void;
}>) {
  const { playerCount, list } = usePlayerSearch();

  return (
    <div className={`flex justify-center ${className}`}>
      <Command shouldFilter={false} className="rounded-lg border shadow-md md:min-w-[450px]">
        <CommandInput
          placeholder={`Search ${playerCount} players...`}
          value={list.filterText}
          onValueChange={list.setFilterText}
        />
        <CommandList>
          <CommandEmpty>No player found</CommandEmpty>
          {list.items.map((player) => (
            <CommandItem
              key={player.id}
              onSelect={() => {
                if (onSelect) {
                  onSelect(player.id);
                }
                list.setFilterText('');
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
