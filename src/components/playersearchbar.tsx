'use client';

import { getPlayerCount } from '@/app/actions';
import { Autocomplete, AutocompleteItem, Button, Form } from '@heroui/react';
import { Player } from '@prisma/client';
import { useAsyncList } from '@react-stately/data';
import React, { useEffect } from 'react';

export default function PlayerSearchBar({
  className,
  onSelectionChange,
}: Readonly<{ className: string; onSelectionChange?: (key: React.Key | null) => void }>) {
  const [playerCount, setPlayerCount] = React.useState<number>(0);

  useEffect(() => {
    getPlayerCount().then(setPlayerCount);
  }, [setPlayerCount]);

  let list = useAsyncList<Player>({
    async load({ signal, filterText }) {
      let res = await fetch(`http://localhost:3000/api/players/search?searchTerm=${filterText}`, {
        signal,
      });
      let json = await res.json();

      return {
        items: json.results,
      };
    },
  });

  return (
    <div className={`flex flex-row items-center ${className}`}>
      <Autocomplete
        isClearable
        inputValue={list.filterText}
        isLoading={list.isLoading}
        items={list.items}
        label={`Search ${playerCount} players`}
        labelPlacement="inside"
        onInputChange={list.setFilterText}
        onSelectionChange={onSelectionChange}
      >
        {(player: Player) => (
          <AutocompleteItem key={player.id}>{player.display_first_last}</AutocompleteItem>
        )}
      </Autocomplete>
    </div>
  );
}
