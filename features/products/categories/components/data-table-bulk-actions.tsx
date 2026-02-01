'use client'

/**
 * DataTableBulkActions
 *
 * Renders the floating toolbar for bulk operations on selected rows.
 * Provides actions for bulk activation, deactivation, and deletion of categories.
 * It integrates with the bulk mutation API hooks and triggers the multi-delete confirmation dialog.
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
  useBulkActivateCategories, 
  useBulkDeactivateCategories 
} from '../api'
import { type Category } from '../types'
import { CategoriesMultiDeleteDialog } from './categories-multi-delete-dialog'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedIds = selectedRows.map((row) => (row.original as Category).id)

  const { mutate: activateCategories } = useBulkActivateCategories()
  const { mutate: deactivateCategories } = useBulkDeactivateCategories()

  const handleBulkStatusChange = (status: 'active' | 'inactive') => {
    if (status === 'active') {
      activateCategories(selectedIds, {
        onSuccess: () => table.resetRowSelection(),
      })
    } else {
      deactivateCategories(selectedIds, {
        onSuccess: () => table.resetRowSelection(),
      })
    }
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='category'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('active')}
              className='size-8'
              aria-label='Activate selected categories'
              title='Activate selected categories'
            >
              <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} />
              <span className='sr-only'>Activate selected categories</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Activate selected categories</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('inactive')}
              className='size-8'
              aria-label='Deactivate selected categories'
              title='Deactivate selected categories'
            >
              <HugeiconsIcon icon={UnavailableIcon} strokeWidth={2} />
              <span className='sr-only'>Deactivate selected categories</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Deactivate selected categories</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label='Delete selected categories'
              title='Delete selected categories'
            >
              <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
              <span className='sr-only'>Delete selected categories</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete selected categories</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <CategoriesMultiDeleteDialog
        table={table}
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      />
    </>
  )
}