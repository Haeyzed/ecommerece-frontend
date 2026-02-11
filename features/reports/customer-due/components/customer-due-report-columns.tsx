'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import type { CustomerDueReportRow } from '../types'

function formatMoney(value: number) {
  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export const customerDueReportColumns: ColumnDef<CustomerDueReportRow>[] = [
  {
    accessorKey: 'date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const date = row.original.date
      if (!date) return '—'
      try {
        return new Date(date + 'T00:00:00').toLocaleDateString(undefined, {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      } catch {
        return date
      }
    },
  },
  {
    accessorKey: 'reference_no',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reference" />
    ),
    cell: ({ row }) => (
      <span className="font-mono">{row.original.reference_no}</span>
    ),
  },
  {
    accessorKey: 'customer_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
    cell: ({ row }) => (
      <div>
        <div>{row.original.customer_name}</div>
        {row.original.customer_phone && (
          <div className="text-muted-foreground text-sm">
            {row.original.customer_phone}
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'grand_total',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Grand Total" />
    ),
    cell: ({ row }) => (
      <span className="tabular-nums">
        {formatMoney(row.original.grand_total)}
      </span>
    ),
    meta: { className: 'text-right', thClassName: 'text-right' },
  },
  {
    accessorKey: 'returned_amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Returned" />
    ),
    cell: ({ row }) => (
      <span className="tabular-nums">
        {formatMoney(row.original.returned_amount)}
      </span>
    ),
    meta: { className: 'text-right', thClassName: 'text-right' },
  },
  {
    accessorKey: 'paid',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Paid" />
    ),
    cell: ({ row }) => (
      <span className="tabular-nums">{formatMoney(row.original.paid)}</span>
    ),
    meta: { className: 'text-right', thClassName: 'text-right' },
  },
  {
    accessorKey: 'due',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Due" />
    ),
    cell: ({ row }) => (
      <span className="tabular-nums font-medium">
        {formatMoney(row.original.due)}
      </span>
    ),
    meta: { className: 'text-right', thClassName: 'text-right' },
  },
]
