'use client'

import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  CheckmarkCircle02Icon,
  Delete02Icon,
  UnavailableIcon,
  Upload01Icon,
} from '@hugeicons/core-free-icons'
import { type Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import {
  useBulkActivateWarehouses,
  useBulkDeactivateWarehouses
} from '../api'
import { type Warehouse } from '../types'
import { WarehousesExportDialog } from './warehouses-export-dialog'
import { WarehousesMultiDeleteDialog } from './warehouses-multi-delete-dialog'
import { useAuthSession } from '@/features/auth/api'
import { Spinner } from '@/components/ui/spinner'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
                                              table,
                                            }: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedIds = selectedRows.map((row) => (row.original as Warehouse).id)

  const { mutate: activateWarehouses, isPending: isActivating } = useBulkActivateWarehouses()
  const { mutate: deactivateWarehouses, isPending: isDeactivating } = useBulkDeactivateWarehouses()

  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []

  const canUpdate = userPermissions.includes('update warehouses')
  const canDelete = userPermissions.includes('delete warehouses')
  const canExport = userPermissions.includes('export warehouses')

  if (!canUpdate && !canDelete && !canExport) return null

  const isBusy = isActivating || isDeactivating

  const handleBulkStatusChange = (status: 'active' | 'inactive') => {
    if (status === 'active') {
      activateWarehouses(selectedIds, {
        onSuccess: () => table.resetRowSelection(),
      })
    } else {
      deactivateWarehouses(selectedIds, {
        onSuccess: () => table.resetRowSelection(),
      })
    }
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='warehouse'>
        {canUpdate && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  onClick={() => handleBulkStatusChange('active')}
                  disabled={isBusy}
                  className='size-8'
                  aria-label='Activate selected warehouses'
                  title='Activate selected warehouses'
                >
                  {isActivating ? (
                    <Spinner className='size-4' />
                  ) : (
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} />
                  )}
                  <span className='sr-only'>Activate selected warehouses</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Activate selected warehouses</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  onClick={() => handleBulkStatusChange('inactive')}
                  disabled={isBusy}
                  className='size-8'
                  aria-label='Deactivate selected warehouses'
                  title='Deactivate selected warehouses'
                >
                  {isDeactivating ? (
                    <Spinner className='size-4' />
                  ) : (
                    <HugeiconsIcon icon={UnavailableIcon} strokeWidth={2} />
                  )}
                  <span className='sr-only'>Deactivate selected warehouses</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Deactivate selected warehouses</p>
              </TooltipContent>
            </Tooltip>
          </>
        )}

        {canExport && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='outline'
                size='icon'
                onClick={() => setShowExportDialog(true)}
                disabled={isBusy}
                className='size-8'
                aria-label='Export selected warehouses'
                title='Export selected warehouses'
              >
                <HugeiconsIcon icon={Upload01Icon} strokeWidth={2} />
                <span className='sr-only'>Export selected warehouses</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Export selected warehouses</p>
            </TooltipContent>
          </Tooltip>
        )}

        {canDelete && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='destructive'
                size='icon'
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isBusy}
                className='size-8'
                aria-label='Delete selected warehouses'
                title='Delete selected warehouses'
              >
                <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                <span className='sr-only'>Delete selected warehouses</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete selected warehouses</p>
            </TooltipContent>
          </Tooltip>
        )}
      </BulkActionsToolbar>

      {canDelete && (
        <WarehousesMultiDeleteDialog
          table={table}
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
        />
      )}

      {canExport && (
        <WarehousesExportDialog
          open={showExportDialog}
          onOpenChange={setShowExportDialog}
          ids={selectedIds}
        />
      )}
    </>
  )
}