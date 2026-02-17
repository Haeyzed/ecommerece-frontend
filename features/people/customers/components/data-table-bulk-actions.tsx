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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { Spinner } from '@/components/ui/spinner'
import {
  useBulkActivateCustomers,
  useBulkDeactivateCustomers,
} from '../api'
import type { Customer } from '../types'
import { CustomersExportDialog } from './customers-export-dialog'
import { CustomersMultiDeleteDialog } from './customers-multi-delete-dialog'
import { useAuthSession } from '@/features/auth/api'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedIds = selectedRows.map((row) => (row.original as Customer).id)
  const { mutate: activateCustomers, isPending: isActivating } =
    useBulkActivateCustomers()
  const { mutate: deactivateCustomers, isPending: isDeactivating } =
    useBulkDeactivateCustomers()
  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []
  const canUpdate = userPermissions.includes('update customers')
  const canDelete = userPermissions.includes('delete customers')
  const canExport = userPermissions.includes('export customers')

  if (!canUpdate && !canDelete && !canExport) return null

  const isBusy = isActivating || isDeactivating

  const handleBulkStatusChange = (status: 'active' | 'inactive') => {
    if (status === 'active') {
      activateCustomers(selectedIds, {
        onSuccess: () => table.resetRowSelection(),
      })
    } else {
      deactivateCustomers(selectedIds, {
        onSuccess: () => table.resetRowSelection(),
      })
    }
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName="customer">
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
                  aria-label="Activate selected customers"
                  title="Activate selected customers"
                >
                  {isActivating ? (
                    <Spinner className="size-4" />
                  ) : (
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} />
                  )}
                  <span className="sr-only">Activate selected customers</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Activate selected customers</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleBulkStatusChange('inactive')}
                  disabled={isBusy}
                  className="size-8"
                  aria-label="Deactivate selected customers"
                  title="Deactivate selected customers"
                >
                  {isDeactivating ? (
                    <Spinner className="size-4" />
                  ) : (
                    <HugeiconsIcon icon={UnavailableIcon} strokeWidth={2} />
                  )}
                  <span className="sr-only">Deactivate selected customers</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Deactivate selected customers</p>
              </TooltipContent>
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
                aria-label="Export selected customers"
                title="Export selected customers"
              >
                <HugeiconsIcon icon={Upload01Icon} strokeWidth={2} />
                <span className="sr-only">Export selected customers</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Export selected customers</p>
            </TooltipContent>
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
                aria-label="Delete selected customers"
                title="Delete selected customers"
              >
                <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                <span className="sr-only">Delete selected customers</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete selected customers</p>
            </TooltipContent>
          </Tooltip>
        )}
      </BulkActionsToolbar>

      {canDelete && (
        <CustomersMultiDeleteDialog
          table={table}
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
        />
      )}

      {canExport && (
        <CustomersExportDialog
          open={showExportDialog}
          onOpenChange={setShowExportDialog}
          ids={selectedIds}
        />
      )}
    </>
  )
}
