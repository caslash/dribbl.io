'use client';

import { SearchResponse } from '@/app/api/players/search/route';
import { getPlayerCount } from '@/server/actions';
import { Player } from '@prisma/client';
import { AsyncListLoadOptions, useAsyncList } from '@react-stately/data';
import { useEffect, useState } from 'react';

const usePlayerSearch = () => {
  const [playerCount, setPlayerCount] = useState<number>(0);

  useEffect(() => {
    getPlayerCount().then(setPlayerCount);
  }, [setPlayerCount]);

  const list = useAsyncList<Player>({
    async load({ signal, filterText }: AsyncListLoadOptions<Player, string>) {
      const res = await fetch(`http://localhost:3000/api/players/search?searchTerm=${filterText}`, {
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
