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
  useBulkActivateEmployees,
  useBulkDeactivateEmployees
} from '@/features/hrm/employees/api'
import { type Employee } from '@/features/hrm/employees/types'
import { EmployeesExportDialog } from '@/features/hrm/employees'
import { EmployeesMultiDeleteDialog } from '@/features/hrm/employees'
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
  const selectedIds = selectedRows.map((row) => (row.original as Employee).id)

  const { mutate: activateEmployees, isPending: isActivating } = useBulkActivateEmployees()
  const { mutate: deactivateEmployees, isPending: isDeactivating } = useBulkDeactivateEmployees()

  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []

  const canUpdate = userPermissions.includes('update employees')
  const canDelete = userPermissions.includes('delete employees')
  const canExport = userPermissions.includes('export employees')

  if (!canUpdate && !canDelete && !canExport) return null

  const isBusy = isActivating || isDeactivating

  const handleBulkStatusChange = (status: 'active' | 'inactive') => {
    if (status === 'active') {
      activateEmployees(selectedIds, {
        onSuccess: () => table.resetRowSelection(),
      })
    } else {
      deactivateEmployees(selectedIds, {
        onSuccess: () => table.resetRowSelection(),
      })
    }
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='employee'>
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
                  aria-label='Activate selected employees'
                  title='Activate selected employees'
                >
                  {isActivating ? (
                    <Spinner className='size-4' />
                  ) : (
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} />
                  )}
                  <span className='sr-only'>Activate selected employees</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Activate selected employees</p>
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
                  aria-label='Deactivate selected employees'
                  title='Deactivate selected employees'
                >
                  {isDeactivating ? (
                    <Spinner className='size-4' />
                  ) : (
                    <HugeiconsIcon icon={UnavailableIcon} strokeWidth={2} />
                  )}
                  <span className='sr-only'>Deactivate selected employees</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Deactivate selected employees</p>
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
                aria-label='Export selected employees'
                title='Export selected employees'
              >
                <HugeiconsIcon icon={Upload01Icon} strokeWidth={2} />
                <span className='sr-only'>Export selected employees</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Export selected employees</p>
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
                aria-label='Delete selected employees'
                title='Delete selected employees'
              >
                <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                <span className='sr-only'>Delete selected employees</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete selected employees</p>
            </TooltipContent>
          </Tooltip>
        )}
      </BulkActionsToolbar>

      {canDelete && (
        <EmployeesMultiDeleteDialog
          table={table}
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
        />
      )}

      {canExport && (
        <EmployeesExportDialog
          open={showExportDialog}
          onOpenChange={setShowExportDialog}
          ids={selectedIds}
        />
      )}
    </>
  )
}