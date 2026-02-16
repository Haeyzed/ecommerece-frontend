'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import type { Biller } from '../types'
import { DataTableRowActions } from './data-table-row-actions'
import { ImageZoomCell } from '@/components/image-zoom'
import { statusTypes } from '../constants'

export const billersColumns: ColumnDef<Biller>[] = [
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
    meta: { className: cn('max-md:sticky start-0 z-10 rounded-tl-[inherit]') },
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
    header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
    cell: ({ row }) => (
      <div className='flex items-center gap-3 ps-3'>
        {row.original.image_url ? (
          <ImageZoomCell src={row.original.image_url} alt={row.original.name} />
        ) : (
          <div className='flex size-10 items-center justify-center rounded-md bg-muted'>
            <span className='text-xs font-medium'>
              {row.original.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
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
    accessorKey: 'company_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Company' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-32'>
        {row.original.company_name ?? '-'}
      </LongText>
    ),
    meta: { className: 'w-32' },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36'>{row.original.email ?? '-'}</LongText>
    ),
    meta: { className: 'w-36' },
  },
  {
    accessorKey: 'phone_number',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Phone' />
    ),
    cell: ({ row }) => <span>{row.original.phone_number ?? '-'}</span>,
    meta: { className: 'w-28' },
  },
  {
    accessorKey: 'city',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='City' />
    ),
    cell: ({ row }) => <span>{row.original.city ?? '-'}</span>,
    meta: { className: 'w-24' },
  },
  {
    accessorKey: 'active_status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const { active_status } = row.original
      const statusBadgeColor = statusTypes.get(active_status)
      return (
        <div className='flex justify-center'>
          <Badge
            variant='outline'
            className={cn('capitalize', statusBadgeColor)}
          >
            {row.getValue('active_status')}
          </Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
    meta: { className: cn('max-md:sticky end-0 z-10 rounded-tr-[inherit]') },
  },
]