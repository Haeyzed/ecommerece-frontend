'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import type { Customer } from '../types'
import { DataTableRowActions } from './data-table-row-actions'
import { statusTypes } from '../constants'

export const customersColumns: ColumnDef<Customer>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    meta: { className: cn('max-md:sticky start-0 z-10 rounded-tl-[inherit]') },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-3 ps-3">
        <div className="flex size-10 items-center justify-center rounded-md bg-muted">
          <span className="text-xs font-medium">
            {String(row.original.name).charAt(0).toUpperCase()}
          </span>
        </div>
        <LongText className="max-w-36">{row.getValue('name')}</LongText>
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
    accessorKey: 'customer_group',
    id: 'customer_group_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Group" />
    ),
    cell: ({ row }) => (
      <LongText className="max-w-28">
        {row.original.customer_group?.name ?? '-'}
      </LongText>
    ),
    meta: { className: 'w-28' },
  },
  {
    accessorKey: 'company_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company" />
    ),
    cell: ({ row }) => (
      <LongText className="max-w-32">
        {row.original.company_name ?? '-'}
      </LongText>
    ),
    meta: { className: 'w-32' },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <LongText className="max-w-36">{row.original.email ?? '-'}</LongText>
    ),
    meta: { className: 'w-36' },
  },
  {
    accessorKey: 'phone_number',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => (
      <span>{row.original.phone_number ?? '-'}</span>
    ),
    meta: { className: 'w-28' },
  },
  {
    accessorKey: 'discount_plans',
    id: 'discount_plan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Discount plan" />
    ),
    cell: ({ row }) => (
      <LongText className="max-w-28">
        {Array.isArray(row.original.discount_plans) && row.original.discount_plans.length > 0
          ? row.original.discount_plans.join(', ')
          : '-'}
      </LongText>
    ),
    meta: { className: 'w-28' },
  },
  {
    accessorKey: 'points',
    id: 'reward_points',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reward points" />
    ),
    cell: ({ row }) => (
      <span>{Number(row.original.points ?? 0)}</span>
    ),
    meta: { className: 'w-24' },
  },
  {
    accessorKey: 'deposited_balance',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Deposited balance" />
    ),
    cell: ({ row }) => {
      const v = row.original.deposited_balance ?? row.original.deposit ?? 0
      return <span>{Number(v).toFixed(2)}</span>
    },
    meta: { className: 'w-28' },
  },
  {
    accessorKey: 'total_due',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total due" />
    ),
    cell: ({ row }) => {
      const v = row.original.total_due ?? 0
      return <span>{Number(v).toFixed(2)}</span>
    },
    meta: { className: 'w-24' },
  },
  {
    accessorKey: 'active_status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const { active_status } = row.original
      const statusBadgeColor = statusTypes.get(active_status ?? 'inactive')
      return (
        <div className='flex justify-center'>
          <Badge
            variant='outline'
            className={cn('capitalize', statusBadgeColor)}
          >
            {row.getValue('active_status') ?? 'inactive'}
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
