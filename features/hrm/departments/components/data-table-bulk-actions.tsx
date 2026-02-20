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
  useBulkActivateDepartments, 
  useBulkDeactivateDepartments 
} from '../api'
import { type Department } from '../types'
import { DepartmentsExportDialog } from './departments-export-dialog'
import { DepartmentsMultiDeleteDialog } from './departments-multi-delete-dialog'
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
  const selectedIds = selectedRows.map((row) => (row.original as Department).id)

  const { mutate: activateDepartments, isPending: isActivating } = useBulkActivateDepartments()
  const { mutate: deactivateDepartments, isPending: isDeactivating } = useBulkDeactivateDepartments()

  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []

  const canUpdate = userPermissions.includes('update departments')
  const canDelete = userPermissions.includes('delete departments')
  const canExport = userPermissions.includes('export departments')

  if (!canUpdate && !canDelete && !canExport) return null

  const isBusy = isActivating || isDeactivating

  const handleBulkStatusChange = (status: 'active' | 'inactive') => {
    if (status === 'active') {
      activateDepartments(selectedIds, {
        onSuccess: () => table.resetRowSelection(),
      })
    } else {
      deactivateDepartments(selectedIds, {
        onSuccess: () => table.resetRowSelection(),
      })
    }
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='department'>
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
                  aria-label='Activate selected departments'
                  title='Activate selected departments'
                >
                  {isActivating ? (
                    <Spinner className='size-4' />
                  ) : (
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} />
                  )}
                  <span className='sr-only'>Activate selected departments</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Activate selected departments</p>
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
                  aria-label='Deactivate selected departments'
                  title='Deactivate selected departments'
                >
                  {isDeactivating ? (
                    <Spinner className='size-4' />
                  ) : (
                    <HugeiconsIcon icon={UnavailableIcon} strokeWidth={2} />
                  )}
                  <span className='sr-only'>Deactivate selected departments</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Deactivate selected departments</p>
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
                aria-label='Export selected departments'
                title='Export selected departments'
              >
                <HugeiconsIcon icon={Upload01Icon} strokeWidth={2} />
                <span className='sr-only'>Export selected departments</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Export selected departments</p>
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
                aria-label='Delete selected departments'
                title='Delete selected departments'
              >
                <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                <span className='sr-only'>Delete selected departments</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete selected departments</p>
            </TooltipContent>
          </Tooltip>
        )}
      </BulkActionsToolbar>

      {canDelete && (
        <DepartmentsMultiDeleteDialog
          table={table}
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
        />
      )}

      {canExport && (
        <DepartmentsExportDialog
          open={showExportDialog}
          onOpenChange={setShowExportDialog}
          ids={selectedIds}
        />
      )}
    </>
  )
}