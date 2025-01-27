'use client';

import PlayerTable from '@/components/playertable';
import useSwr from 'swr';
import React from 'react';

const fetcher = (input: RequestInfo | URL, init?: RequestInit) =>
  fetch(input, init).then((res) => res.json());

export default function Players() {
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(1);

  const { data, isLoading } = useSwr(
    `http://localhost:3000/api/players?page=${page}&rowsPerPage=${rowsPerPage}`,
    fetcher,
    { keepPreviousData: true },
  );

  const { players, total: totalPlayers } = data ?? { players: [], totalPlayers: 0 };

  const pages = React.useMemo(() => {
    return totalPlayers ? Math.ceil(totalPlayers / rowsPerPage) : 0;
  }, [totalPlayers, rowsPerPage]);

  const loadingState = isLoading || data?.players.length === 0 ? 'loading' : 'idle';

  return (
    <div>
      <PlayerTable
        players={players}
        totalPlayers={totalPlayers}
        page={page}
        totalPages={pages}
        loadingState={loadingState}
        setPage={setPage}
        setRowsPerPage={setRowsPerPage}
      />
    </div>
  );
}
