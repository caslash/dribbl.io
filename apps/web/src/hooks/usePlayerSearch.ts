'use client';

import { Player } from '@dribblio/database';
import { SearchResponse } from '@dribblio/types';
import { AsyncListLoadOptions, useAsyncList } from '@react-stately/data';
import { useEffect, useState } from 'react';

const usePlayerSearch = () => {
  const [playerCount, setPlayerCount] = useState<number>(0);

  useEffect(() => {
    fetch('/api/players/count')
      .then((res) => res.json())
      .then(setPlayerCount);
  }, [setPlayerCount]);

  const list = useAsyncList<Player>({
    async load({ signal, filterText }: AsyncListLoadOptions<Player, string>) {
      const res = await fetch(`/api/players/search?searchTerm=${filterText}`, {
        signal,
      });
      const json: SearchResponse = await res.json();

      return {
        items: json.results,
      };
    },
  });

  return { playerCount, list };
};

export default usePlayerSearch;
