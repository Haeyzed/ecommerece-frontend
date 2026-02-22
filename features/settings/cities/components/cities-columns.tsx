"use client"

import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type City } from '../types'
import { DataTableRowActions } from './data-table-row-actions'

export const citiesColumns: ColumnDef<City>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    meta: {
      className: cn('max-md:sticky start-0 z-10 rounded-tl-[inherit]'),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => (
      <div className='flex items-center gap-3 ps-3'>
        <div className='flex size-10 items-center justify-center rounded-md bg-muted'>
          <span className='text-xs font-medium'>
            {row.original.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <LongText className='max-w-36'>{row.getValue('name')}</LongText>
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
    accessorKey: 'country_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Country' />
    ),
    cell: ({ row }) => (
      <span className='font-medium'>{row.original.country?.name || '-'}</span>
    ),
    meta: { className: 'w-32' },
  },
  {
    accessorKey: 'state_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='State' />
    ),
    cell: ({ row }) => (
      <span className='font-medium'>{row.original.state?.name || '-'}</span>
    ),
    meta: { className: 'w-32' },
  },
  {
    accessorKey: 'country_code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Country Code' />
    ),
    cell: ({ row }) => (
      <span className='uppercase'>{row.original.country_code || '-'}</span>
    ),
    meta: { className: 'w-24' },
  },
  {
    accessorKey: 'state_code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='State Code' />
    ),
    cell: ({ row }) => (
      <span>{row.original.state_code || '-'}</span>
    ),
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