'use client'

/**
 * DataTableBulkActions
 *
 * Renders the floating toolbar for bulk operations on selected unit rows.
 * Provides actions for bulk activation, deactivation, and deletion.
 *
 * @component
 * @template TData - The type of data in the table
 * @param {Object} props - The component props
 * @param {Table<TData>} props.table - The TanStack table instance containing selection state
 */

import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  CheckmarkCircle02Icon,
  Delete02Icon,
  UnavailableIcon
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
  useBulkActivateUnits,
  useBulkDeactivateUnits
} from '../api'
import { type Unit } from '../types'
import { UnitsMultiDeleteDialog } from './units-multi-delete-dialog'
import { useAuthSession } from '@/features/auth/api'
import { Spinner } from '@/components/ui/spinner'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedIds = selectedRows.map((row) => (row.original as Unit).id)
  const { mutate: activateUnits, isPending: isActivating } = useBulkActivateUnits()
  const { mutate: deactivateUnits, isPending: isDeactivating } = useBulkDeactivateUnits()
  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []
  const canUpdate = userPermissions.includes('units-update')
  const canDelete = userPermissions.includes('units-delete')
  if (!canUpdate && !canDelete) return null
  const isBusy = isActivating || isDeactivating

  const handleBulkStatusChange = (status: 'active' | 'inactive') => {
    if (status === 'active') {
      activateUnits(selectedIds, {
        onSuccess: () => table.resetRowSelection(),
      })
    } else {
      deactivateUnits(selectedIds, {
        onSuccess: () => table.resetRowSelection(),
      })
    }
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='unit'>
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
                  aria-label='Activate selected units'
                  title='Activate selected units'
                >
                  {isActivating ? (
                    <Spinner className='size-4' />
                  ) : (
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} />
                  )}
                  <span className='sr-only'>Activate selected units</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Activate selected units</p>
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
                  aria-label='Deactivate selected units'
                  title='Deactivate selected units'
                >
                  {isDeactivating ? (
                    <Spinner className='size-4' />
                  ) : (
                    <HugeiconsIcon icon={UnavailableIcon} strokeWidth={2} />
                  )}
                  <span className='sr-only'>Deactivate selected units</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Deactivate selected units</p>
              </TooltipContent>
            </Tooltip>
          </>
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
                aria-label='Delete selected units'
                title='Delete selected units'
              >
                <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                <span className='sr-only'>Delete selected units</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete selected units</p>
            </TooltipContent>
          </Tooltip>
        )}
      </BulkActionsToolbar>

      {canDelete && (
        <UnitsMultiDeleteDialog
          table={table}
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
        />
      )}
    </>
  )
}