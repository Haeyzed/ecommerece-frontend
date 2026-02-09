'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { DataTableColumnHeader, DataTableExpandButton } from '@/components/data-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableRowActions } from './data-table-row-actions'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { LongText } from '@/components/long-text'
import type { Audit } from '../types'
import { ChevronRight } from 'lucide-react'

import { formatAuditValues } from '../utils/format-audit-values'

/** Rendered inside the expandable row; shows old/new values. */
export function AuditLogExpandedContent({ audit }: { audit: Audit }) {
  const hasOld = audit.old_values && Object.keys(audit.old_values).length > 0
  const hasNew = audit.new_values && Object.keys(audit.new_values).length > 0
  if (!hasOld && !hasNew) return <span className="text-muted-foreground">No changes</span>

  const oldEntries = formatAuditValues(audit.old_values)
  const newEntries = formatAuditValues(audit.new_values)

  return (
    <div className="space-y-4 text-sm">
      {hasOld && (
        <div className="space-y-1.5">
          <p className="font-semibold text-destructive">Old values</p>
          <div className="space-y-1 rounded border bg-muted/30 p-3">
            {oldEntries.map(({ label, value }) => (
              <div key={label} className="flex gap-2">
                <span className="font-medium text-muted-foreground shrink-0">{label}:</span>
                <span className="break-all">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {hasNew && (
        <div className="space-y-1.5">
          <p className="font-semibold text-green-600 dark:text-green-400">New values</p>
          <div className="space-y-1 rounded border bg-muted/30 p-3">
            {newEntries.map(({ label, value }) => (
              <div key={label} className="flex gap-2">
                <span className="font-medium text-muted-foreground shrink-0">{label}:</span>
                <span className="break-all">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function getAuditableTypeLabel(auditableType: string): string {
  const parts = auditableType.split('\\')
  return parts[parts.length - 1] ?? auditableType
}

function ValuesDiff({ audit }: { audit: Audit }) {
  const hasOld = audit.old_values && Object.keys(audit.old_values).length > 0
  const hasNew = audit.new_values && Object.keys(audit.new_values).length > 0
  if (!hasOld && !hasNew) return <span className="text-muted-foreground">-</span>

  const oldEntries = formatAuditValues(audit.old_values)
  const newEntries = formatAuditValues(audit.new_values)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-left hover:underline focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <ChevronRight className="h-4 w-4 shrink-0" />
          <span className="text-muted-foreground">
            {hasOld && hasNew ? 'View diff' : hasOld ? 'View old' : 'View new'}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="max-h-80 w-auto max-w-2xl overflow-auto">
        <div className="space-y-4 text-sm">
          {hasOld && (
            <div className="space-y-1.5">
              <p className="font-semibold text-destructive">Old values</p>
              <div className="space-y-1 rounded border bg-muted/30 p-3">
                {oldEntries.map(({ label, value }) => (
                  <div key={label} className="flex gap-2">
                    <span className="font-medium text-muted-foreground shrink-0">
                      {label}:
                    </span>
                    <span className="break-all">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {hasNew && (
            <div className="space-y-1.5">
              <p className="font-semibold text-green-600 dark:text-green-400">
                New values
              </p>
              <div className="space-y-1 rounded border bg-muted/30 p-3">
                {newEntries.map(({ label, value }) => (
                  <div key={label} className="flex gap-2">
                    <span className="font-medium text-muted-foreground shrink-0">
                      {label}:
                    </span>
                    <span className="break-all">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export const auditColumns: ColumnDef<Audit>[] = [
  {
    id: 'date_from',
    header: () => null,
    cell: () => null,
    enableHiding: true,
    enableSorting: false,
  },
  {
    id: 'date_to',
    header: () => null,
    cell: () => null,
    enableHiding: true,
    enableSorting: false,
  },
  {
    id: 'expand',
    header: () => null,
    cell: ({ row }) => (
      <DataTableExpandButton row={row} canExpand={row.getCanExpand()} />
    ),
    meta: { className: cn('w-10 max-md:sticky start-0 z-10 rounded-tl-[inherit]') },
    enableSorting: false,
    enableHiding: false,
  },
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
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    meta: { className: cn('max-md:sticky start-10 z-10') },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const createdAt = row.original.created_at
      if (!createdAt) return '-'
      try {
        const d = new Date(createdAt)
        return (
          <span className="tabular-nums">
            {d.toLocaleDateString()} {d.toLocaleTimeString()}
          </span>
        )
      } catch {
        return createdAt
      }
    },
    meta: { className: 'w-40' },
  },
  {
    accessorKey: 'event',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Event" />
    ),
    cell: ({ row }) => {
      const event = row.original.event
      const variant =
        event === 'created'
          ? 'default'
          : event === 'updated'
            ? 'secondary'
            : event === 'deleted'
              ? 'destructive'
              : 'outline'
      return <Badge variant={variant}>{event}</Badge>
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    meta: { className: 'w-24' },
  },
  {
    accessorKey: 'auditable_type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Model" />
    ),
    cell: ({ row }) => (
      <span className="font-medium">
        {getAuditableTypeLabel(row.original.auditable_type)}
      </span>
    ),
    meta: { className: 'w-32' },
  },
  {
    accessorKey: 'auditable_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => (
      <span className="tabular-nums">
        {row.original.auditable_id ?? '-'}
      </span>
    ),
    meta: { className: 'w-20' },
  },
  {
    accessorKey: 'user',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User" />
    ),
    cell: ({ row }) => (
      <LongText className="max-w-36">
        {row.original.user?.name ?? '-'}
      </LongText>
    ),
    meta: { className: 'w-36' },
  },
  {
    accessorKey: 'old_values',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Changes" />
    ),
    cell: ({ row }) => <ValuesDiff audit={row.original} />,
    meta: { className: 'min-w-24' },
  },
  {
    accessorKey: 'ip_address',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="IP" />
    ),
    cell: ({ row }) => (
      <span className="tabular-nums text-muted-foreground">
        {row.original.ip_address ?? '-'}
      </span>
    ),
    meta: { className: 'w-36' },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
    meta: {
      className: cn('max-md:sticky end-0 z-10 rounded-tr-[inherit]'),
    },
  },
]
