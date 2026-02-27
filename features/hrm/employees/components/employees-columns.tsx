"use client"

import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { statusTypes, salesAgentTypes } from '@/features/hrm/employees/constants'
import { type Employee } from '@/features/hrm/employees/types'
import { DataTableRowActions } from './data-table-row-actions'

export const employeesColumns: ColumnDef<Employee>[] = [
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
        <div className="flex flex-col">
          <LongText className='max-w-40 font-semibold'>{row.getValue('name')}</LongText>
          <span className="text-xs text-muted-foreground">{row.original.staff_id}</span>
        </div>
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
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Contact' />
    ),
    cell: ({ row }) => (
      <div className='flex flex-col'>
        <span className="text-sm">{row.original.email || '-'}</span>
        <span className="text-xs text-muted-foreground">{row.original.phone_number || '-'}</span>
      </div>
    ),
  },
  {
    id: 'department_designation',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Role' />
    ),
    cell: ({ row }) => (
      <div className='flex flex-col'>
        <span className="text-sm font-medium">{row.original.designation?.name || '-'}</span>
        <span className="text-xs text-muted-foreground">{row.original.department?.name || '-'}</span>
      </div>
    ),
  },
  {
    accessorKey: 'sales_agent',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Sales Agent' />
    ),
    cell: ({ row }) => {
      const { sales_agent } = row.original
      const badgeColor = salesAgentTypes.get(sales_agent)
      return (
        <Badge variant='outline' className={cn('capitalize', badgeColor)}>
          {row.getValue('sales_agent')}
        </Badge>
      )
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
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
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
    meta: {
      className: cn('max-md:sticky end-0 z-10 rounded-tr-[inherit]'),
    },
  },
]