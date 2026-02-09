'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import type { ActivityLog } from '../types'

export const activityLogColumns: ColumnDef<ActivityLog>[] = [
  {
    accessorKey: 'date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Date' />
    ),
    cell: ({ row }) => (
      <span className='tabular-nums'>{row.original.date ?? '-'}</span>
    ),
    meta: { className: 'w-28' },
  },
  {
    accessorKey: 'user_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='User' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36'>{row.original.user_name ?? '-'}</LongText>
    ),
    meta: { className: 'w-36' },
  },
  {
    accessorKey: 'action',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Action' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-48'>{row.original.action ?? '-'}</LongText>
    ),
    meta: { className: 'w-48' },
  },
  {
    accessorKey: 'reference_no',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Reference No' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-32'>
        {row.original.reference_no ?? '-'}
      </LongText>
    ),
    meta: { className: 'w-32' },
  },
  {
    accessorKey: 'item_description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Item Description' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-64 line-clamp-2'>
        {row.original.item_description ?? '-'}
      </LongText>
    ),
    meta: { className: 'w-64' },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created At' />
    ),
    cell: ({ row }) => {
      const createdAt = row.original.created_at
      if (!createdAt) return '-'
      try {
        const d = new Date(createdAt)
        return d.toLocaleString()
      } catch {
        return createdAt
      }
    },
    meta: { className: 'w-40' },
  },
]
