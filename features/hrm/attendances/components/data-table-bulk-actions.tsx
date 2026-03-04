'use client'

import { useState } from 'react'

import {
  Alert02Icon,
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
  AttendancesExportDialog,
  AttendancesMultiDeleteDialog,
} from '@/features/hrm/attendances'
import {
  useBulkMarkLateAttendances,
  useBulkMarkPresentAttendances,
} from '@/features/hrm/attendances/api'
import { type Attendance } from '@/features/hrm/attendances/types'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedIds = selectedRows.map((row) => (row.original as Attendance).id)

  const { mutate: markPresent, isPending: isMarkingPresent } =
    useBulkMarkPresentAttendances()
  const { mutate: markLate, isPending: isMarkingLate } =
    useBulkMarkLateAttendances()

  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []

  const canUpdateStatus = userPermissions.includes('update attendances')
  const canDelete = userPermissions.includes('delete attendances')
  const canExport = userPermissions.includes('export attendances')

  if (!canUpdateStatus && !canDelete && !canExport) return null

  const isBusy = isMarkingPresent || isMarkingLate

  const handleBulkStatusChange = (status: 'present' | 'late') => {
    if (status === 'present') {
      markPresent(selectedIds, { onSuccess: () => table.resetRowSelection() })
    } else {
      markLate(selectedIds, { onSuccess: () => table.resetRowSelection() })
    }
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='attendance'>
        {canUpdateStatus && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  onClick={() => handleBulkStatusChange('present')}
                  disabled={isBusy}
                  className='size-8 text-teal-600 hover:bg-teal-50 hover:text-teal-700'
                  aria-label='Mark selected as present'
                >
                  {isMarkingPresent ? (
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
                <p>Mark selected as present</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  onClick={() => handleBulkStatusChange('late')}
                  disabled={isBusy}
                  className='size-8 text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700'
                  aria-label='Mark selected as late'
                >
                  {isMarkingLate ? (
                    <Spinner className='size-4' />
                  ) : (
                    <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Mark selected as late</p>
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
                aria-label='Export selected attendances'
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
                aria-label='Delete selected attendances'
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
        <AttendancesMultiDeleteDialog
          table={table}
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
        />
      )}

      {canExport && (
        <AttendancesExportDialog
          open={showExportDialog}
          onOpenChange={setShowExportDialog}
          ids={selectedIds}
        />
      )}
    </>
  )
}
