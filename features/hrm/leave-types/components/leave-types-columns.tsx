"use client"

import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { statusTypes } from '@/features/hrm/leave-types/constants'
import { type LeaveType } from '@/features/hrm/leave-types/types'
import { DataTableRowActions } from './data-table-row-actions'

export const leaveTypesColumns: ColumnDef<LeaveType>[] = [
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
        <LongText className='max-w-40 font-medium'>{row.getValue('name')}</LongText>
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
    accessorKey: 'annual_quota',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Annual Quota' />
    ),
    cell: ({ row }) => (
      <div className="font-mono">{row.original.annual_quota} days</div>
    ),
  },
  {
    accessorKey: 'carry_forward_limit',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Carry Forward' />
    ),
    cell: ({ row }) => (
      <div className="font-mono">{row.original.carry_forward_limit} days</div>
    ),
  },
  {
    accessorKey: 'encashable',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Encashable' />
    ),
    cell: ({ row }) => {
      const isEncashable = row.original.encashable
      return (
        <Badge variant={isEncashable ? 'default' : 'secondary'} className='font-normal'>
          {isEncashable ? 'Yes' : 'No'}
        </Badge>
      )
    },
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
          <Badge variant='outline' className={cn('capitalize', statusBadgeColor)}>
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
    meta: {
      className: cn('max-md:sticky end-0 z-10 rounded-tr-[inherit]'),
    },
  },
]