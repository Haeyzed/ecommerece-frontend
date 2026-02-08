'use client'

/**
 * DataTableBulkActions
 *
 * Renders the floating toolbar for bulk operations on selected brand rows.
 * Provides actions for bulk activation, deactivation, and deletion.
 *
 * @component
 * @template TData - The type of data in the table
 * @param {Object} props - The component props
 * @param {Table<TData>} props.table - The TanStack table instance
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
  useBulkActivateBrands, 
  useBulkDeactivateBrands 
} from '../api'
import { type Brand } from '../types'
import { BrandsMultiDeleteDialog } from './brands-multi-delete-dialog'
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
  const selectedIds = selectedRows.map((row) => (row.original as Brand).id)
  const { mutate: activateBrands, isPending: isActivating } = useBulkActivateBrands()
  const { mutate: deactivateBrands, isPending: isDeactivating } = useBulkDeactivateBrands()
  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []
  const canUpdate = userPermissions.includes('brands-update')
  const canDelete = userPermissions.includes('brands-delete')
  if (!canUpdate && !canDelete) return null
  const isBusy = isActivating || isDeactivating

  const handleBulkStatusChange = (status: 'active' | 'inactive') => {
    if (status === 'active') {
      activateBrands(selectedIds, {
        onSuccess: () => table.resetRowSelection(),
      })
    } else {
      deactivateBrands(selectedIds, {
        onSuccess: () => table.resetRowSelection(),
      })
    }
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='brand'>
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
                  aria-label='Activate selected brands'
                  title='Activate selected brands'
                >
                  {isActivating ? (
                    <Spinner className='size-4' />
                  ) : (
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} />
                  )}
                  <span className='sr-only'>Activate selected brands</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Activate selected brands</p>
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
                  aria-label='Deactivate selected brands'
                  title='Deactivate selected brands'
                >
                  {isDeactivating ? (
                    <Spinner className='size-4' />
                  ) : (
                    <HugeiconsIcon icon={UnavailableIcon} strokeWidth={2} />
                  )}
                  <span className='sr-only'>Deactivate selected brands</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Deactivate selected brands</p>
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
                aria-label='Delete selected brands'
                title='Delete selected brands'
              >
                <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                <span className='sr-only'>Delete selected brands</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete selected brands</p>
            </TooltipContent>
          </Tooltip>
        )}
      </BulkActionsToolbar>

      {canDelete && (
        <BrandsMultiDeleteDialog
          table={table}
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
        />
      )}
    </>
  )
}