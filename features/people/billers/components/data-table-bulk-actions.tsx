'use client'

import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  CheckmarkCircle02Icon,
  Delete02Icon,
  UnavailableIcon,
  Upload01Icon
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
  useBulkActivateBillers,
  useBulkDeactivateBillers
} from '../api'
import { type Biller } from '../types'
import { BillersExportDialog } from './billers-export-dialog'
import { BillersMultiDeleteDialog } from './billers-multi-delete-dialog'
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
  const selectedIds = selectedRows.map((row) => (row.original as Biller).id)
  const { mutate: activateBillers, isPending: isActivating } = useBulkActivateBillers()
  const { mutate: deactivateBillers, isPending: isDeactivating } = useBulkDeactivateBillers()
  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []
  const canUpdate = userPermissions.includes('update billers')
  const canDelete = userPermissions.includes('delete billers')
  const canExport = userPermissions.includes('export billers')

  if (!canUpdate && !canDelete && !canExport) return null

  const isBusy = isActivating || isDeactivating

  const handleBulkStatusChange = (status: 'active' | 'inactive') => {
    if (status === 'active') {
      activateBillers(selectedIds, {
        onSuccess: () => table.resetRowSelection(),
      })
    } else {
      deactivateBillers(selectedIds, {
        onSuccess: () => table.resetRowSelection(),
      })
    }
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='biller'>
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
                  aria-label='Activate selected billers'
                  title='Activate selected billers'
                >
                  {isActivating ? (
                    <Spinner className='size-4' />
                  ) : (
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} />
                  )}
                  <span className='sr-only'>Activate selected billers</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Activate selected billers</p>
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
                  aria-label='Deactivate selected billers'
                  title='Deactivate selected billers'
                >
                  {isDeactivating ? (
                    <Spinner className='size-4' />
                  ) : (
                    <HugeiconsIcon icon={UnavailableIcon} strokeWidth={2} />
                  )}
                  <span className='sr-only'>Deactivate selected billers</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Deactivate selected billers</p>
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
                aria-label='Export selected billers'
                title='Export selected billers'
              >
                <HugeiconsIcon icon={Upload01Icon} strokeWidth={2} />
                <span className='sr-only'>Export selected billers</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Export selected billers</p>
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
                aria-label='Delete selected billers'
                title='Delete selected billers'
              >
                <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                <span className='sr-only'>Delete selected billers</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete selected billers</p>
            </TooltipContent>
          </Tooltip>
        )}
      </BulkActionsToolbar>

      {canDelete && (
        <BillersMultiDeleteDialog
          table={table}
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
        />
      )}

      {canExport && (
        <BillersExportDialog
          open={showExportDialog}
          onOpenChange={setShowExportDialog}
          ids={selectedIds}
        />
      )}
    </>
  )
}