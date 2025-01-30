'use client';

import usePlayerSearch from '@/hooks/usePlayerSearch';
import { Autocomplete, AutocompleteItem } from '@heroui/react';
import { Player } from '@prisma/client';
import React from 'react';

export default function PlayerSearchBar({
  className,
  onSelectionChange,
}: Readonly<{ className: string; onSelectionChange?: (key: React.Key | null) => void }>) {
  const { playerCount, list } = usePlayerSearch();

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
