'use client';

import { Player } from '@prisma/client';
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
import { LoadingState } from '@react-types/shared';
import React from 'react';

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
  players,
  totalPlayers,
  page,
  totalPages,
  loadingState,
  setPage,
  setRowsPerPage,
}: Readonly<{
  players: Player[];
  totalPlayers: number;
  page: number;
  totalPages: number;
  loadingState: LoadingState;
  setPage: (page: number) => void;
  setRowsPerPage: (rows: number) => void;
}>) {
  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    [setPage, setRowsPerPage],
  );

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total: {totalPlayers} players</span>
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
      </div>
    );
  }, [totalPlayers, onRowsPerPageChange]);

  return (
    <div className="flex flex-col items-center">
      <Table
        className="w-2/3"
        aria-label="Players"
        isStriped
        topContent={topContent}
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
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
