"use client"

import { useState, useMemo } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader, DataTableExpandButton } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { statusTypes } from '@/features/settings/acl/roles/constants'
import { type Role } from '@/features/settings/acl/roles/types'
import { DataTableRowActions } from './data-table-row-actions'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SearchIcon } from 'lucide-react'

export function RoleExpandedContent({ role }: { role: Role }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showAll, setShowAll] = useState(false)
  const ITEM_LIMIT = 30

  const permissions = useMemo(() => role.permissions || [], [role.permissions])

  const filteredPermissions = useMemo(() => {
    if (!searchQuery) return permissions
    return permissions.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [permissions, searchQuery])

  const visiblePermissions = showAll ? filteredPermissions : filteredPermissions.slice(0, ITEM_LIMIT)

  if (permissions.length === 0) {
    return <span className="text-sm text-muted-foreground p-4 block">No permissions assigned to this role.</span>
  }

  return (
    <div className="p-4 space-y-3 bg-muted/10 border-b">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-muted-foreground">
          Assigned Permissions ({filteredPermissions.length})
        </p>
        <div className="flex items-center gap-2">
          <div className="relative w-48">
            <SearchIcon className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search permissions..."
              className="pl-8 h-8 text-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {filteredPermissions.length > ITEM_LIMIT && (
            <Button
              variant="link"
              size="sm"
              onClick={() => setShowAll(!showAll)}
              className="h-auto p-0 ml-2 text-xs"
            >
              {showAll ? 'Show less' : `Show all ${filteredPermissions.length}`}
            </Button>
          )}
        </div>
      </div>

      {filteredPermissions.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {visiblePermissions.map((p) => (
            <Badge key={p.id} variant="secondary" className="font-normal">
              {p.name}
            </Badge>
          ))}
        </div>
      ) : (
        <span className="text-sm text-muted-foreground italic block pt-1">
          No permissions match your search.
        </span>
      )}
    </div>
  )
}

export const rolesColumns: ColumnDef<Role>[] = [
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
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    meta: {
      className: cn('max-md:sticky start-10 z-10'),
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
        <LongText className='max-w-36 font-semibold'>{row.getValue('name')}</LongText>
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
    accessorKey: 'guard_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Guard' />
    ),
    cell: ({ row }) => (
      <Badge variant="secondary" className="font-mono">{row.original.guard_name}</Badge>
    ),
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Description' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-48 text-muted-foreground'>{row.original.description || '-'}</LongText>
    ),
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