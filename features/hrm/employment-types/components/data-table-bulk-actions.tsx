'use client'

import { useState } from 'react'

import {
  CheckmarkCircle02Icon,
  Delete02Icon,
  UnavailableIcon,
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
  EmploymentTypesExportDialog,
  EmploymentTypesMultiDeleteDialog,
} from '@/features/hrm/employment-types'
import {
  useBulkActivateEmploymentTypes,
  useBulkDeactivateEmploymentTypes,
} from '@/features/hrm/employment-types/api'
import { type EmploymentType } from '@/features/hrm/employment-types/types'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedIds = selectedRows.map(
    (row) => (row.original as EmploymentType).id
  )

  const { mutate: activateEmploymentTypes, isPending: isActivating } =
    useBulkActivateEmploymentTypes()
  const { mutate: deactivateEmploymentTypes, isPending: isDeactivating } =
    useBulkDeactivateEmploymentTypes()

  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []

  const canUpdate = userPermissions.includes('update employment types')
  const canDelete = userPermissions.includes('delete employment types')
  const canExport = userPermissions.includes('export employment types')

  if (!canUpdate && !canDelete && !canExport) return null

  const isBusy = isActivating || isDeactivating

  const handleBulkStatusChange = (status: 'active' | 'inactive') => {
    if (status === 'active') {
      activateEmploymentTypes(selectedIds, {
        onSuccess: () => table.resetRowSelection(),
      })
    } else {
      deactivateEmploymentTypes(selectedIds, {
        onSuccess: () => table.resetRowSelection(),
      })
    }
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='employment type'>
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
                  aria-label='Activate selected employment types'
                  title='Activate selected employment types'
                >
                  {isActivating ? (
                    <Spinner className='size-4' />
                  ) : (
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      strokeWidth={2}
                    />
                  )}
                  <span className='sr-only'>
                    Activate selected employment types
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Activate selected employment types</p>
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
                  aria-label='Deactivate selected employment types'
                  title='Deactivate selected employment types'
                >
                  {isDeactivating ? (
                    <Spinner className='size-4' />
                  ) : (
                    <HugeiconsIcon icon={UnavailableIcon} strokeWidth={2} />
                  )}
                  <span className='sr-only'>
                    Deactivate selected employment types
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Deactivate selected employment types</p>
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
                aria-label='Export selected employment types'
                title='Export selected employment types'
              >
                <HugeiconsIcon icon={Upload01Icon} strokeWidth={2} />
                <span className='sr-only'>Export selected employment types</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Export selected employment types</p>
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
                aria-label='Delete selected employment types'
                title='Delete selected employment types'
              >
                <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                <span className='sr-only'>Delete selected employment types</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete selected employment types</p>
            </TooltipContent>
          </Tooltip>
        )}
      </BulkActionsToolbar>

      {canDelete && (
        <EmploymentTypesMultiDeleteDialog
          table={table}
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
        />
      )}

      {canExport && (
        <EmploymentTypesExportDialog
          open={showExportDialog}
          onOpenChange={setShowExportDialog}
          ids={selectedIds}
        />
      )}
    </>
  )
}
