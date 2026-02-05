"use client"

/**
 * categoriesColumns
 *
 * Defines the column definitions for the TanStack React Table used in the categories module.
 * It maps data properties to table columns and defines custom cell renderers for
 * badges, images, and actions.
 *
 * @constant
 */

import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { statusTypes, featuredTypes, syncTypes } from '../constants'
import { type Category } from '../types'
import { DataTableRowActions } from './data-table-row-actions'
import { HugeiconsIcon } from '@hugeicons/react'
import { ImageZoomCell } from '@/components/image-zoom'

export const categoriesColumns: ColumnDef<Category>[] = [
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
          <ImageZoomCell
            src={row.original.image_url}
            alt={row.original.name}
          />
        ) : row.original.icon_url ? (
          <ImageZoomCell
            src={row.original.icon_url}
            alt={row.original.name}
          />
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
    accessorKey: 'slug',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Slug' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36'>
        {row.original.slug || '-'}
      </LongText>
    ),
    meta: { className: 'w-36' },
  },
  {
    accessorKey: 'short_description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Description' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-48'>
        {row.original.short_description || '-'}
      </LongText>
    ),
    meta: { className: 'w-48' },
  },
  {
    accessorKey: 'parent_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Parent Category' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36'>
        {row.original.parent_name || '-'}
      </LongText>
    ),
    meta: { className: 'w-36' },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const { status } = row.original
      const statusBadgeColor = statusTypes.get(status)
      return (
        <div className='flex justify-center'>
          <Badge variant='outline' className={cn('capitalize', statusBadgeColor)}>
            {row.getValue('status')}
          </Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'featured_status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Featured Status' />
    ),
    cell: ({ row }) => {
      const { featured_status } = row.original
      const featuredStatusBadgeColor = featuredTypes.get(featured_status)
      return (
        <div className='flex justify-center'>
          <Badge variant='outline' className={cn('capitalize', featuredStatusBadgeColor)}>
            {row.getValue('featured_status')}
          </Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'sync_status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Sync Status' />
    ),
    cell: ({ row }) => {
      const { sync_status } = row.original
      const syncStatusbadgeColor = syncTypes.get(sync_status)
      return (
        <div className='flex justify-center'>
          <Badge variant='outline' className={cn('capitalize', syncStatusbadgeColor)}>
            {row.getValue('sync_status')}
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