"use client"

import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { statusTypes } from '../constants'
import { type Country } from '../types'
import { DataTableRowActions } from './data-table-row-actions'

export const countriesColumns: ColumnDef<Country>[] = [
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
            {row.original.emoji || row.original.name.charAt(0).toUpperCase()}
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
    accessorKey: 'iso2',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ISO2' />
    ),
    cell: ({ row }) => (
      <span className='uppercase'>{row.original.iso2}</span>
    ),
    meta: { className: 'w-24' },
  },
  {
    accessorKey: 'iso3',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ISO3' />
    ),
    cell: ({ row }) => (
      <span className='uppercase'>{row.original.iso3 || '-'}</span>
    ),
    meta: { className: 'w-24' },
  },
  {
    accessorKey: 'phone_code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Phone Code' />
    ),
    cell: ({ row }) => (
      <span>{row.original.phone_code ? `+${row.original.phone_code}` : '-'}</span>
    ),
    meta: { className: 'w-32' },
  },
  {
    accessorKey: 'region',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Region' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-32'>
        {row.original.region || '-'}
      </LongText>
    ),
    meta: { className: 'w-32' },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.original.status === 1 ? 'active' : 'inactive'
      const statusBadgeColor = statusTypes.get(status)
      return (
        <Badge variant='outline' className={cn('capitalize', statusBadgeColor)}>
          {status}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.original.status === 1 ? 'active' : 'inactive')
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
    meta: {
      className: cn('max-md:sticky end-0 z-10 rounded-tr-[inherit]'),
    },
  },
]