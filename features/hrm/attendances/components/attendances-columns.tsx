"use client"

import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { attendanceStatusStyles } from '@/features/hrm/attendances/constants'
import { type Attendance } from '@/features/hrm/attendances/types'
import { DataTableRowActions } from './data-table-row-actions'

export const attendancesColumns: ColumnDef<Attendance>[] = [
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
    accessorKey: 'employee_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Employee' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36 font-semibold'>
        {row.original.employee?.name || `Emp #${row.original.employee_id}`}
      </LongText>
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
    accessorKey: 'date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Date' />
    ),
    cell: ({ row }) => (
      <span className="font-mono text-muted-foreground">{row.original.date}</span>
    ),
  },
  {
    accessorKey: 'checkin',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Check In' />
    ),
    cell: ({ row }) => (
      <span className="font-mono text-muted-foreground">{row.original.checkin || '-'}</span>
    ),
  },
  {
    accessorKey: 'checkout',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Check Out' />
    ),
    cell: ({ row }) => (
      <span className="font-mono text-muted-foreground">{row.original.checkout || '-'}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const { status } = row.original
      const statusBadgeColor = attendanceStatusStyles.get(status) || 'bg-neutral-100/50'
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