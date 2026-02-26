"use client"

import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { statusTypes } from '@/features/hrm/holidays/constants'
import { type Holiday } from '@/features/hrm/holidays/types'
import { DataTableRowActions } from './data-table-row-actions'
import { format } from 'date-fns'

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
    accessorKey: 'note',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Note / Reason' />
    ),
    cell: ({ row }) => (
      <div className='flex items-center gap-3 ps-3'>
        <LongText className='max-w-40 font-medium'>{row.getValue('note') || '-'}</LongText>
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
    accessorKey: 'from_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='From Date' />
    ),
    cell: ({ row }) => (
      <div className="font-mono text-sm">{row.original.from_date ? format(new Date(row.original.from_date), 'MMM dd, yyyy') : '-'}</div>
    ),
  },
  {
    accessorKey: 'to_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='To Date' />
    ),
    cell: ({ row }) => (
      <div className="font-mono text-sm">{row.original.to_date ? format(new Date(row.original.to_date), 'MMM dd, yyyy') : '-'}</div>
    ),
  },
  {
    accessorKey: 'region',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Region' />
    ),
    cell: ({ row }) => (
      <span>{row.original.region || 'Global'}</span>
    ),
  },
  {
    accessorKey: 'recurring',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Recurring' />
    ),
    cell: ({ row }) => {
      const isRecurring = row.original.recurring
      return (
        <Badge variant={isRecurring ? 'default' : 'secondary'} className='font-normal'>
          {isRecurring ? 'Yes' : 'No'}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'approve_status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.original.approve_status
      const statusBadgeColor = statusTypes.get(status)
      return (
        <div className='flex justify-start'>
          <Badge variant='outline' className={cn('capitalize', statusBadgeColor)}>
            {status}
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
    meta: {
      className: cn('max-md:sticky end-0 z-10 rounded-tr-[inherit]'),
    },
  },
]