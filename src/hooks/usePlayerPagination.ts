'use client';
import { PaginatedResponse } from '@/app/api/players/route';
import { Player } from '@prisma/client';
import { LoadingState } from '@react-types/shared';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import useSwr from 'swr';

const usePlayerPagination = () => {
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(1);

  const { data, isLoading }: { data: PaginatedResponse; isLoading: boolean } = useSwr(
    `http://localhost:3000/api/players?page=${page}&rowsPerPage=${rowsPerPage}`,
    (input: RequestInfo | URL, init?: RequestInit) => fetch(input, init).then((res) => res.json()),
    { keepPreviousData: true },
  );

  const { players, total: totalPlayers }: { players: Player[]; total: number } = data ?? {
    players: [],
    total: 0,
  };

  const totalPages: number = useMemo(() => {
    return totalPlayers ? Math.ceil(totalPlayers / rowsPerPage) : 0;
  }, [totalPlayers, rowsPerPage]);

  const loadingState: LoadingState = isLoading || data?.players.length === 0 ? 'loading' : 'idle';

  const onRowsPerPageChange: (e: ChangeEvent<HTMLSelectElement>) => void = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    [setPage, setRowsPerPage],
  );

  return { players, page, setPage, totalPages, onRowsPerPageChange, loadingState };
};

export default usePlayerPagination;
