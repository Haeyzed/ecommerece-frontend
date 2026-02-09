'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { LongText } from '@/components/long-text'
import type { Audit } from '../types'
import { ChevronRight } from 'lucide-react'

function getAuditableTypeLabel(auditableType: string): string {
  const parts = auditableType.split('\\')
  return parts[parts.length - 1] ?? auditableType
}

function formatValues(values: Record<string, unknown> | null): string {
  if (!values || typeof values !== 'object') return '-'
  try {
    return JSON.stringify(values, null, 2)
  } catch {
    return String(values)
  }
}

function ValuesDiff({ audit }: { audit: Audit }) {
  const hasOld = audit.old_values && Object.keys(audit.old_values).length > 0
  const hasNew = audit.new_values && Object.keys(audit.new_values).length > 0
  if (!hasOld && !hasNew) return <span className="text-muted-foreground">-</span>

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
        <div className="space-y-2 font-mono text-xs">
          {hasOld && (
            <div>
              <p className="mb-1 font-semibold text-destructive">Old values</p>
              <pre className="whitespace-pre-wrap break-all rounded border bg-muted/30 p-2">
                {formatValues(audit.old_values)}
              </pre>
            </div>
          )}
          {hasNew && (
            <div>
              <p className="mb-1 font-semibold text-green-600 dark:text-green-400">
                New values
              </p>
              <pre className="whitespace-pre-wrap break-all rounded border bg-muted/30 p-2">
                {formatValues(audit.new_values)}
              </pre>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export const auditColumns: ColumnDef<Audit>[] = [
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
]
