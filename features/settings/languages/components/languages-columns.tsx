'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import type { Language } from '../types'
import { DataTableRowActions } from './data-table-row-actions'

export const languagesColumns: ColumnDef<Language>[] = [
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
    accessorKey: 'code',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Code" />,
    cell: ({ row }) => <span className="font-mono text-sm">{row.original.code}</span>,
    meta: { className: 'w-20' },
  },
  {
    accessorKey: 'name_native',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Native Name" />,
    cell: ({ row }) => <LongText className="max-w-32">{row.original.name_native ?? '-'}</LongText>,
    meta: { className: 'w-32' },
  },
  {
    accessorKey: 'dir',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Direction" />,
    cell: ({ row }) => <span className="text-sm">{row.original.dir ?? '-'}</span>,
    meta: { className: 'w-24' },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
    meta: {
      className: cn('max-md:sticky end-0 z-10 rounded-tr-[inherit]'),
    },
  },
]
