'use client';

import fetcher from '@/utils/fetcher';
import {
  Table,
  TableBody,
  TableColumn,
  TableCell,
  TableHeader,
  TableRow,
  getKeyValue,
  Pagination,
  Spinner,
} from '@heroui/react';
import { Player } from '@prisma/client';
import React from 'react';
import useSwr from 'swr';

const columns: { key: string; label: string }[] = [
  {
    key: 'first_name',
    label: 'First',
  },
  {
    key: 'last_name',
    label: 'Last',
  },
  {
    key: 'school',
    label: 'School',
  },
  {
    key: 'height',
    label: 'Height',
  },
  {
    key: 'weight',
    label: 'Weight',
  },
  {
    key: 'season_exp',
    label: 'Exp',
  },
  {
    key: 'position',
    label: 'Position',
  },
];

export default function PlayerTable({
  className,
}: Readonly<React.ComponentPropsWithoutRef<'div'>>) {
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(1);

  const { data, isLoading } = useSwr(
    `http://localhost:3000/api/players?page=${page}&rowsPerPage=${rowsPerPage}`,
    fetcher,
    { keepPreviousData: true },
  );

  const { players, total: totalPlayers }: { players: Player[]; total: number } = data ?? {
    players: [],
    total: 0,
  };

  const totalPages = React.useMemo(() => {
    return totalPlayers ? Math.ceil(totalPlayers / rowsPerPage) : 0;
  }, [totalPlayers, rowsPerPage]);

  const loadingState = isLoading || data?.players.length === 0 ? 'loading' : 'idle';

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    [setPage, setRowsPerPage],
  );

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4 items-end">
        <label className="flex items-center text-default-400 text-small">
          Rows per page:
          <select
            className="bg-transparent outline-none text-default-400 text-small"
            onChange={onRowsPerPageChange}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </label>
      </div>
    );
  }, [totalPlayers, onRowsPerPageChange]);

  return (
    <div className={className}>
      <Table
        aria-label="Players"
        isStriped
        topContent={topContent}
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              dotsJump={10}
              initialPage={1}
              color="secondary"
              page={page}
              total={totalPages}
              onChange={setPage}
            />
          </div>
        }
      >
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={players} loadingContent={<Spinner />} loadingState={loadingState}>
          {(player) => (
            <TableRow key={player.id}>
              {(columnKey) => <TableCell>{getKeyValue(player, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
