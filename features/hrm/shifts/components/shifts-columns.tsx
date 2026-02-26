"use client"

import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { statusTypes } from '@/features/hrm/shifts'
import { type Shift } from '@/features/hrm/shifts'
import { DataTableRowActions } from './data-table-row-actions'

export const shiftsColumns: ColumnDef<Shift>[] = [
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
      <DataTableColumnHeader column={column} title='Shift Name' />
    ),
    cell: ({ row }) => (
      <div className='flex items-center gap-3 ps-3'>
        <LongText className='max-w-36 font-semibold'>{row.getValue('name')}</LongText>
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
    accessorKey: 'start_time',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Start Time' />
    ),
    cell: ({ row }) => {
      // Convert HH:MM:SS to HH:MM format naturally
      const time = row.original.start_time?.substring(0, 5) || '-';
      return <span className='font-medium'>{time}</span>
    },
  },
  {
    accessorKey: 'end_time',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='End Time' />
    ),
    cell: ({ row }) => {
      const time = row.original.end_time?.substring(0, 5) || '-';
      return <span className='font-medium'>{time}</span>
    },
  },
  {
    accessorKey: 'total_hours',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Total Hrs' />
    ),
    cell: ({ row }) => (
      <span className='font-mono text-muted-foreground'>{row.original.total_hours}h</span>
    ),
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
        <div className='flex justify-start'>
          <Badge
            variant='outline'
            className={cn('capitalize', statusBadgeColor)}
          >
            {active_status}
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