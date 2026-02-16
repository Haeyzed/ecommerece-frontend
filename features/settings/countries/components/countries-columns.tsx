"use client"

import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type Country } from '../types'
import { DataTableRowActions } from './data-table-row-actions'

export const countriesColumns: ColumnDef<Country>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
    cell: ({ row }) => (
      <div className='flex items-center gap-3 ps-3'>
        <div className='flex size-10 items-center justify-center rounded-md bg-muted'>
          <span className='text-xs font-medium'>{row.original.name.charAt(0).toUpperCase()}</span>
        </div>
        <LongText className='max-w-36'>{row.getValue('name')}</LongText>
      </div>
    ),
    meta: { className: cn('ps-0.5 max-md:sticky start-0') },
    enableHiding: false,
  },
  {
    accessorKey: 'iso2',
    header: ({ column }) => <DataTableColumnHeader column={column} title='ISO2' />,
    cell: ({ row }) => <span className='font-mono text-sm'>{row.original.iso2}</span>,
    meta: { className: 'w-20' },
  },
  {
    accessorKey: 'iso3',
    header: ({ column }) => <DataTableColumnHeader column={column} title='ISO3' />,
    cell: ({ row }) => <span className='font-mono text-sm'>{row.original.iso3 ?? '-'}</span>,
    meta: { className: 'w-20' },
  },
  {
    accessorKey: 'phone_code',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Phone Code' />,
    cell: ({ row }) => <LongText className='max-w-24'>{row.original.phone_code ?? '-'}</LongText>,
    meta: { className: 'w-24' },
  },
  {
    accessorKey: 'region',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Region' />,
    cell: ({ row }) => <LongText className='max-w-32'>{row.original.region ?? '-'}</LongText>,
    meta: { className: 'w-32' },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
    meta: { className: cn('max-md:sticky end-0 z-10 rounded-tr-[inherit]') },
  },
]
