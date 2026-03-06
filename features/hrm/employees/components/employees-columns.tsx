'use client'

import { type ColumnDef } from '@tanstack/react-table'

import { cn } from '@/lib/utils'

import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'

import { DataTableColumnHeader } from '@/components/data-table'
import { ImageZoomCell } from '@/components/image-zoom'
import { LongText } from '@/components/long-text'

import {
  salesAgentTypes,
  statusTypes,
} from '@/features/hrm/employees/constants'
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
        {row.original.image_url ? (
          <ImageZoomCell src={row.original.image_url} alt={row.original.name} />
        ) : (
          <div className='flex size-10 items-center justify-center rounded-md bg-muted'>
            <span className='text-xs font-medium'>
              {row.original.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className='flex flex-col'>
          <LongText className='max-w-40 font-semibold'>
            {row.getValue('name')}
          </LongText>
          <span className='text-xs text-muted-foreground'>
            {row.original.staff_id}
          </span>
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
        <span className='text-sm'>{row.original.email || '-'}</span>
        <span className='text-xs text-muted-foreground'>
          {row.original.phone_number || '-'}
        </span>
      </div>
    ),
  },
  {
    id: 'department_designation',
    accessorKey: 'department_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Role' />
    ),
    cell: ({ row }) => (
      <div className='flex flex-col'>
        <span className='text-sm font-medium'>
          {row.original.designation?.name || '-'}
        </span>
        <span className='text-xs text-muted-foreground'>
          {row.original.department?.name || '-'}
        </span>
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(String(row.original.department?.id))
    },
  },
  {
    accessorKey: 'designation_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Designation' />
    ),
    cell: ({ row }) => (
      <span className='text-sm'>{row.original.designation?.name || '-'}</span>
    ),
    enableHiding: true,
    filterFn: (row, id, value) => {
      return value.includes(String(row.original.designation?.id))
    },
  },
  {
    accessorKey: 'employment_type_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Type' />
    ),
    cell: ({ row }) => (
      <span className='text-sm'>
        {row.original.employment_type?.name || '-'}
      </span>
    ),
    filterFn: (row, id, value) => {
      return value.includes(String(row.original.employment_type?.id))
    },
  },
  {
    accessorKey: 'reporting_manager_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Manager' />
    ),
    cell: ({ row }) => (
      <span className='text-sm'>
        {row.original.reporting_manager?.name || '-'}
      </span>
    ),
    enableHiding: true,
    filterFn: (row, id, value) => {
      return value.includes(String(row.original.reporting_manager_id))
    },
  },
  {
    accessorKey: 'shift_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Shift' />
    ),
    cell: ({ row }) => (
      <span className='text-sm'>{row.original.shift?.name || '-'}</span>
    ),
    enableHiding: true,
    filterFn: (row, id, value) => {
      return value.includes(String(row.original.shift?.id))
    },
  },
  {
    accessorKey: 'country_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Country' />
    ),
    cell: ({ row }) => (
      <span className='text-sm'>{row.original.country?.name || '-'}</span>
    ),
    enableHiding: true,
    filterFn: (row, id, value) => {
      return value.includes(String(row.original.country?.id))
    },
  },
  {
    accessorKey: 'state_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='State' />
    ),
    cell: ({ row }) => (
      <span className='text-sm'>{row.original.state?.name || '-'}</span>
    ),
    enableHiding: true,
    filterFn: (row, id, value) => {
      return value.includes(String(row.original.state?.id))
    },
  },
  {
    accessorKey: 'city_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='City' />
    ),
    cell: ({ row }) => (
      <span className='text-sm'>{row.original.city?.name || '-'}</span>
    ),
    enableHiding: true,
    filterFn: (row, id, value) => {
      return value.includes(String(row.original.city?.id))
    },
  },
  {
    accessorKey: 'is_sale_agent',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Sales Agent' />
    ),
    cell: ({ row }) => {
      const isSaleAgent = row.original.is_sale_agent
      const badgeColor = salesAgentTypes.get(isSaleAgent ? 'yes' : 'no')
      return (
        <Badge variant='outline' className={cn('capitalize', badgeColor)}>
          {isSaleAgent ? 'Yes' : 'No'}
        </Badge>
      )
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'is_active',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const isActive = row.original.is_active
      const statusBadgeColor = statusTypes.get(isActive ? 'active' : 'inactive')
      return (
        <div className='flex justify-start'>
          <Badge
            variant='outline'
            className={cn('capitalize', statusBadgeColor)}
          >
            {isActive ? 'Active' : 'Inactive'}
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
