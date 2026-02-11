'use client'

import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  CheckmarkCircle02Icon,
  Delete02Icon,
  UnavailableIcon,
  Upload01Icon,
} from '@hugeicons/core-free-icons'
import type { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { Spinner } from '@/components/ui/spinner'
import type { CustomerGroup } from '../types'
import {
  useBulkActivateCustomerGroups,
  useBulkDeactivateCustomerGroups,
} from '../api'
import { CustomerGroupsMultiDeleteDialog } from './customer-groups-multi-delete-dialog'
import { CustomerGroupsExportDialog } from './customer-groups-export-dialog'
import { useAuthSession } from '@/features/auth/api'

type DataTableBulkActionsProps<TData> = { table: Table<TData> }

export function DataTableBulkActions<TData>({ table }: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedIds = selectedRows.map((row) => (row.original as CustomerGroup).id)
  const { mutate: activateCustomerGroups, isPending: isActivating } = useBulkActivateCustomerGroups()
  const { mutate: deactivateCustomerGroups, isPending: isDeactivating } = useBulkDeactivateCustomerGroups()
  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions ?? []
  const canUpdate = userPermissions.includes('customer-groups-update')
  const canDelete = userPermissions.includes('customer-groups-delete')
  const canExport = userPermissions.includes('customer-groups-export')
  if (!canUpdate && !canDelete && !canExport) return null
  const isBusy = isActivating || isDeactivating

  const handleBulkStatusChange = (status: 'active' | 'inactive') => {
    if (status === 'active') {
      activateCustomerGroups(selectedIds, { onSuccess: () => table.resetRowSelection() })
    } else {
      deactivateCustomerGroups(selectedIds, { onSuccess: () => table.resetRowSelection() })
    }
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName="customer group">
        {canUpdate && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleBulkStatusChange('active')}
                  disabled={isBusy}
                  className="size-8"
                  aria-label="Activate selected customer groups"
                >
                  {isActivating ? <Spinner className="size-4" /> : <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} />}
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Activate selected customer groups</p></TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleBulkStatusChange('inactive')}
                  disabled={isBusy}
                  className="size-8"
                  aria-label="Deactivate selected customer groups"
                >
                  {isDeactivating ? <Spinner className="size-4" /> : <HugeiconsIcon icon={UnavailableIcon} strokeWidth={2} />}
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Deactivate selected customer groups</p></TooltipContent>
            </Tooltip>
          </>
        )}
        {canExport && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowExportDialog(true)}
                disabled={isBusy}
                className="size-8"
                aria-label="Export selected customer groups"
              >
                <HugeiconsIcon icon={Upload01Icon} strokeWidth={2} />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Export selected customer groups</p></TooltipContent>
          </Tooltip>
        )}
        {canDelete && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isBusy}
                className="size-8"
                aria-label="Delete selected customer groups"
              >
                <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Delete selected customer groups</p></TooltipContent>
          </Tooltip>
        )}
      </BulkActionsToolbar>
      {canDelete && (
        <CustomerGroupsMultiDeleteDialog table={table} open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm} />
      )}
      {canExport && (
        <CustomerGroupsExportDialog
          open={showExportDialog}
          onOpenChange={setShowExportDialog}
          ids={selectedIds}
        />
      )}
    </>
  )
}
