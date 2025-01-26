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
} from '@heroui/react';
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
    label: 'XP',
  },
  {
    key: 'jersey',
    label: 'Jersey #',
  },
  {
    key: 'position',
    label: 'Position',
  },
];

export default function PlayerTable({ players }: Readonly<{ players: Player[] }>) {
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;

  const pages = Math.ceil(players.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return players.slice(start, end);
  }, [page, players]);

  return (
    <div className="flex flex-col items-center">
      <Table
        className="w-2/3"
        aria-label="Players"
        isStriped
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="secondary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        }
      >
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={items}>
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
