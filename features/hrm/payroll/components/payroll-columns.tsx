"use client"

import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { payrollRunStatusStyles } from '@/features/hrm/payroll/constants'
import { type PayrollRun } from '@/features/hrm/payroll/types'
import { DataTableRowActions } from '@/features/hrm/payroll'

export const payrollColumns: ColumnDef<PayrollRun>[] = [
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
    accessorKey: 'month',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Month' />
    ),
    cell: ({ row }) => {
      const month = row.original.month
      const year = row.original.year
      return <span className='font-medium'>{month} / {year}</span>
    },
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'ps-0.5 max-md:sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none'
      ),
    },
    enableHiding: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = (row.getValue('status') as string) ?? 'draft'
      const statusBadgeColor = payrollRunStatusStyles.get(status) || 'bg-neutral-100/50'
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
    id: 'entries_count',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Entries' />
    ),
    cell: ({ row }) => {
      const count = row.original.entries_count ?? row.original.entries?.length ?? '-'
      return (
        <span className='text-muted-foreground'>
          {typeof count === 'number' ? count : '-'}
        </span>
      )
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
