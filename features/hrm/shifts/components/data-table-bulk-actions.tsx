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
  useBulkActivateShifts,
  useBulkDeactivateShifts
} from '../api'
import { type Shift } from '../types'
import { ShiftsExportDialog } from '@/features/hrm/shifts'
import { ShiftsMultiDeleteDialog } from '@/features/hrm/shifts'
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
  const selectedIds = selectedRows.map((row) => (row.original as Shift).id)

  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []

  const canDelete = userPermissions.includes('delete shifts')
  const canUpdate = userPermissions.includes('update shifts')
  const canExport = userPermissions.includes('export shifts')

  const { mutate: bulkActivate, isPending: isActivating } = useBulkActivateShifts()
  const { mutate: bulkDeactivate, isPending: isDeactivating } = useBulkDeactivateShifts()

  const isBusy = isActivating || isDeactivating

  if (!canDelete && !canUpdate && !canExport) return null

  return (
    <>
      <BulkActionsToolbar table={table} entityName='shift'>
        {canUpdate && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  onClick={() => bulkActivate(selectedIds, { onSuccess: () => table.resetRowSelection() })}
                  disabled={isBusy}
                  className='size-8'
                  aria-label='Activate selected shifts'
                  title='Activate selected shifts'
                >
                  {isActivating ? <Spinner className='size-4' /> : <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} />}
                  <span className='sr-only'>Activate selected shifts</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Activate selected shifts</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  onClick={() => bulkDeactivate(selectedIds, { onSuccess: () => table.resetRowSelection() })}
                  disabled={isBusy}
                  className='size-8'
                  aria-label='Deactivate selected shifts'
                  title='Deactivate selected shifts'
                >
                  {isDeactivating ? <Spinner className='size-4' /> : <HugeiconsIcon icon={UnavailableIcon} strokeWidth={2} />}
                  <span className='sr-only'>Deactivate selected shifts</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Deactivate selected shifts</p>
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
                aria-label='Export selected shifts'
                title='Export selected shifts'
              >
                <HugeiconsIcon icon={Upload01Icon} strokeWidth={2} />
                <span className='sr-only'>Export selected shifts</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Export selected shifts</p>
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
                aria-label='Delete selected shifts'
                title='Delete selected shifts'
              >
                <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                <span className='sr-only'>Delete selected shifts</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete selected shifts</p>
            </TooltipContent>
          </Tooltip>
        )}
      </BulkActionsToolbar>

      {canDelete && (
        <ShiftsMultiDeleteDialog
          table={table}
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
        />
      )}

      {canExport && (
        <ShiftsExportDialog
          open={showExportDialog}
          onOpenChange={setShowExportDialog}
          ids={selectedIds}
        />
      )}
    </>
  )
}