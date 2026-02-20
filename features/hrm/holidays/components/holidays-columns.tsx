'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/data-table';
import { LongText } from '@/components/long-text';
import { approvalStatusTypes } from '../constants';
import type { Holiday } from '../types';
import { DataTableRowActions } from './data-table-row-actions';

function approvalStatus(holiday: Holiday): 'approved' | 'pending' {
  return holiday.is_approved ? 'approved' : 'pending';
}

export const holidaysColumns: ColumnDef<Holiday>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    meta: {
      className: cn('max-md:sticky start-0 z-10 rounded-tl-[inherit]'),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'from_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="From" />
    ),
    cell: ({ row }) => {
      const v = row.getValue('from_date') as string | null;
      return (
        <div className="flex items-center gap-3 ps-3">
          {v ? new Date(v).toLocaleDateString() : '—'}
        </div>
      );
    },
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'ps-0.5 max-md:sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none'
      ),
    },
  },
  {
    accessorKey: 'to_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="To" />
    ),
    cell: ({ row }) => {
      const v = row.getValue('to_date') as string | null;
      return (
        <div className="flex items-center gap-3">
          {v ? new Date(v).toLocaleDateString() : '—'}
        </div>
      );
    },
  },
  {
    accessorKey: 'note',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Note" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <LongText className="max-w-36">{row.getValue('note') ?? '—'}</LongText>
      </div>
    ),
  },
  {
    id: 'user',
    header: () => <span>Assignee</span>,
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex flex-col">
              <span className="font-medium">{user.name}</span>
              <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
          ) : (
            '—'
          )}
        </div>
      );
    },
  },
  {
    id: 'approval_status',
    accessorFn: (row) => (row.is_approved ? 'approved' : 'pending'),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = approvalStatus(row.original);
      const statusBadgeColor = approvalStatusTypes.get(status);
      return (
        <div className="flex justify-center">
          <Badge variant="outline" className={cn('capitalize', statusBadgeColor)}>
            {status}
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
    meta: {
      className: cn('max-md:sticky end-0 z-10 rounded-tr-[inherit]'),
    },
  },
];
