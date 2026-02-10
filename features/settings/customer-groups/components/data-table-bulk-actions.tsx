'use client'

import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Delete02Icon } from '@hugeicons/core-free-icons'
import type { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import type { CustomerGroup } from '../types'
import { CustomerGroupsMultiDeleteDialog } from './customer-groups-multi-delete-dialog'
import { useAuthSession } from '@/features/auth/api'

type DataTableBulkActionsProps<TData> = { table: Table<TData> }

export function DataTableBulkActions<TData>({ table }: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const selectedIds = table.getFilteredSelectedRowModel().rows.map((row) => (row.original as CustomerGroup).id)
  const canDelete = useAuthSession().data?.user?.user_permissions?.includes('customer-groups-delete')
  if (!canDelete) return null
  return (
    <>
      <BulkActionsToolbar table={table} entityName="customer group">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => setShowDeleteConfirm(true)}
              className="size-8"
              aria-label="Delete selected customer groups"
            >
              <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Delete selected customer groups</p></TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>
      <CustomerGroupsMultiDeleteDialog table={table} open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm} />
    </>
  )
}
