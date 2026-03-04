'use client'

import { useState } from 'react'

import {
  CancelCircleIcon,
  CheckmarkCircle02Icon,
  Delete02Icon,
  Upload01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { type Table } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'

import { useAuthSession } from '@/features/auth/api'
import {
  OvertimesExportDialog,
  OvertimesMultiDeleteDialog,
} from '@/features/hrm/overtimes'
import {
  useBulkApproveOvertimes,
  useBulkRejectOvertimes,
} from '@/features/hrm/overtimes/api'
import { type Overtime } from '@/features/hrm/overtimes/types'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedIds = selectedRows.map((row) => (row.original as Overtime).id)

  const { mutate: approveOvertimes, isPending: isApproving } =
    useBulkApproveOvertimes()
  const { mutate: rejectOvertimes, isPending: isRejecting } =
    useBulkRejectOvertimes()

  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []

  const canApproveReject = userPermissions.includes('update overtimes')
  const canDelete = userPermissions.includes('delete overtimes')
  const canExport = userPermissions.includes('export overtimes')

  if (!canApproveReject && !canDelete && !canExport) return null

  const isBusy = isApproving || isRejecting

  const handleBulkStatusChange = (status: 'Approved' | 'Rejected') => {
    if (status === 'Approved') {
      approveOvertimes(selectedIds, {
        onSuccess: () => table.resetRowSelection(),
      })
    } else {
      rejectOvertimes(selectedIds, {
        onSuccess: () => table.resetRowSelection(),
      })
    }
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='overtime'>
        {canApproveReject && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  onClick={() => handleBulkStatusChange('Approved')}
                  disabled={isBusy}
                  className='size-8 text-teal-600 hover:bg-teal-50 hover:text-teal-700'
                  aria-label='Approve selected overtimes'
                >
                  {isApproving ? (
                    <Spinner className='size-4' />
                  ) : (
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      strokeWidth={2}
                    />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Approve selected</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  onClick={() => handleBulkStatusChange('Rejected')}
                  disabled={isBusy}
                  className='size-8 text-destructive hover:bg-destructive/10 hover:text-destructive/90'
                  aria-label='Reject selected overtimes'
                >
                  {isRejecting ? (
                    <Spinner className='size-4' />
                  ) : (
                    <HugeiconsIcon icon={CancelCircleIcon} strokeWidth={2} />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reject selected</p>
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
                aria-label='Export selected overtimes'
              >
                <HugeiconsIcon icon={Upload01Icon} strokeWidth={2} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Export selected</p>
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
                aria-label='Delete selected overtimes'
              >
                <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete selected</p>
            </TooltipContent>
          </Tooltip>
        )}
      </BulkActionsToolbar>

      {canDelete && (
        <OvertimesMultiDeleteDialog
          table={table}
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
        />
      )}

      {canExport && (
        <OvertimesExportDialog
          open={showExportDialog}
          onOpenChange={setShowExportDialog}
          ids={selectedIds}
        />
      )}
    </>
  )
}
