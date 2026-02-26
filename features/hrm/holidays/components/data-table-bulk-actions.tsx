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
  useBulkApproveHolidays,
  useBulkUnapproveHolidays
} from '@/features/hrm/holidays/api'
import { type Holiday } from '@/features/hrm/holidays/types'
import { HolidaysExportDialog } from '@/features/hrm/holidays'
import { HolidaysMultiDeleteDialog } from '@/features/hrm/holidays'
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
  const selectedIds = selectedRows.map((row) => (row.original as Holiday).id)

  const { mutate: approveHolidays, isPending: isApproving } = useBulkApproveHolidays()
  const { mutate: unapproveHolidays, isPending: isUnapproving } = useBulkUnapproveHolidays()

  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []

  const canUpdate = userPermissions.includes('update holidays')
  const canDelete = userPermissions.includes('delete holidays')
  const canExport = userPermissions.includes('export holidays')

  if (!canUpdate && !canDelete && !canExport) return null

  const isBusy = isApproving || isUnapproving

  const handleBulkStatusChange = (status: 'approved' | 'unapproved') => {
    if (status === 'approved') {
      approveHolidays(selectedIds, {
        onSuccess: () => table.resetRowSelection(),
      })
    } else {
      unapproveHolidays(selectedIds, {
        onSuccess: () => table.resetRowSelection(),
      })
    }
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='holiday'>
        {canUpdate && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  onClick={() => handleBulkStatusChange('approved')}
                  disabled={isBusy}
                  className='size-8'
                  aria-label='Approve selected holidays'
                  title='Approve selected holidays'
                >
                  {isApproving ? (
                    <Spinner className='size-4' />
                  ) : (
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} />
                  )}
                  <span className='sr-only'>Approve selected holidays</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Approve selected holidays</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  onClick={() => handleBulkStatusChange('unapproved')}
                  disabled={isBusy}
                  className='size-8'
                  aria-label='Unapprove selected holidays'
                  title='Unapprove selected holidays'
                >
                  {isUnapproving ? (
                    <Spinner className='size-4' />
                  ) : (
                    <HugeiconsIcon icon={UnavailableIcon} strokeWidth={2} />
                  )}
                  <span className='sr-only'>Unapprove selected holidays</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Unapprove selected holidays</p>
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
                aria-label='Export selected holidays'
                title='Export selected holidays'
              >
                <HugeiconsIcon icon={Upload01Icon} strokeWidth={2} />
                <span className='sr-only'>Export selected holidays</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Export selected holidays</p>
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
                aria-label='Delete selected holidays'
                title='Delete selected holidays'
              >
                <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                <span className='sr-only'>Delete selected holidays</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete selected holidays</p>
            </TooltipContent>
          </Tooltip>
        )}
      </BulkActionsToolbar>

      {canDelete && (
        <HolidaysMultiDeleteDialog
          table={table}
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
        />
      )}

      {canExport && (
        <HolidaysExportDialog
          open={showExportDialog}
          onOpenChange={setShowExportDialog}
          ids={selectedIds}
        />
      )}
    </>
  )
}