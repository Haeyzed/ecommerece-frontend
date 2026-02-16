'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import type { City } from '../types'
import { DataTableRowActions } from './data-table-row-actions'

export const citiesColumns: ColumnDef<City>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-3 ps-3">
        <div className="flex size-10 items-center justify-center rounded-md bg-muted">
          <span className="text-xs font-medium">{row.original.name.charAt(0).toUpperCase()}</span>
        </div>
        <LongText className="max-w-36">{row.getValue('name')}</LongText>
      </div>
    ),
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'ps-0.5 max-md:sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none'
      ),
    },
    enableHiding: false,
  },
  {
    accessorKey: 'state_code',
    header: ({ column }) => <DataTableColumnHeader column={column} title="State Code" />,
    cell: ({ row }) => <span className="font-mono text-sm">{row.original.state_code ?? '-'}</span>,
    meta: { className: 'w-24' },
  },
  {
    accessorKey: 'state',
    header: ({ column }) => <DataTableColumnHeader column={column} title="State" />,
    cell: ({ row }) => <LongText className="max-w-32">{row.original.state?.name ?? '-'}</LongText>,
    meta: { className: 'w-32' },
  },
  {
    accessorKey: 'country',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Country" />,
    cell: ({ row }) => <LongText className="max-w-32">{row.original.country?.name ?? '-'}</LongText>,
    meta: { className: 'w-32' },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
    meta: {
      className: cn('max-md:sticky end-0 z-10 rounded-tr-[inherit]'),
    },
  },
]
