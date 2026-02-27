'use client'

import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  CheckmarkCircle02Icon,
  Delete02Icon,
  CancelCircleIcon,
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
  useBulkApproveLeaves,
  useBulkRejectLeaves
} from '@/features/hrm/leaves/api'
import { type Leave } from '@/features/hrm/leaves/types'
import { LeavesExportDialog } from '@/features/hrm/leaves'
import { LeavesMultiDeleteDialog } from '@/features/hrm/leaves'
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
  const selectedIds = selectedRows.map((row) => (row.original as Leave).id)

  const { mutate: approveLeaves, isPending: isApproving } = useBulkApproveLeaves()
  const { mutate: rejectLeaves, isPending: isRejecting } = useBulkRejectLeaves()

  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []

  const canApproveReject = userPermissions.includes('update leaves')
  const canDelete = userPermissions.includes('delete leaves')
  const canExport = userPermissions.includes('export leaves')

  if (!canApproveReject && !canDelete && !canExport) return null

  const isBusy = isApproving || isRejecting

  const handleBulkStatusChange = (status: 'Approved' | 'Rejected') => {
    if (status === 'Approved') {
      approveLeaves(selectedIds, { onSuccess: () => table.resetRowSelection() })
    } else {
      rejectLeaves(selectedIds, { onSuccess: () => table.resetRowSelection() })
    }
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='leave'>
        {canApproveReject && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  onClick={() => handleBulkStatusChange('Approved')}
                  disabled={isBusy}
                  className='size-8 text-teal-600 hover:text-teal-700 hover:bg-teal-50'
                  aria-label='Approve selected leaves'
                >
                  {isApproving ? (
                    <Spinner className='size-4' />
                  ) : (
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Approve selected</p></TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  onClick={() => handleBulkStatusChange('Rejected')}
                  disabled={isBusy}
                  className='size-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10'
                  aria-label='Reject selected leaves'
                >
                  {isRejecting ? (
                    <Spinner className='size-4' />
                  ) : (
                    <HugeiconsIcon icon={CancelCircleIcon} strokeWidth={2} />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Reject selected</p></TooltipContent>
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
                aria-label='Export selected leaves'
              >
                <HugeiconsIcon icon={Upload01Icon} strokeWidth={2} />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Export selected</p></TooltipContent>
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
                aria-label='Delete selected leaves'
              >
                <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Delete selected</p></TooltipContent>
          </Tooltip>
        )}
      </BulkActionsToolbar>

      {canDelete && (
        <LeavesMultiDeleteDialog
          table={table}
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
        />
      )}

      {canExport && (
        <LeavesExportDialog
          open={showExportDialog}
          onOpenChange={setShowExportDialog}
          ids={selectedIds}
        />
      )}
    </>
  )
}