'use client'

/**
 * DataTableBulkActions
 *
 * Renders the floating toolbar for bulk operations on selected tax rows.
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
  useBulkActivateTaxes, 
  useBulkDeactivateTaxes 
} from '../api'
import { type Tax } from '../types'
import { TaxesMultiDeleteDialog } from './taxes-multi-delete-dialog'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedIds = selectedRows.map((row) => (row.original as Tax).id)

  const { mutate: activateTaxes } = useBulkActivateTaxes()
  const { mutate: deactivateTaxes } = useBulkDeactivateTaxes()

  const handleBulkStatusChange = (status: 'active' | 'inactive') => {
    if (status === 'active') {
      activateTaxes(selectedIds, {
        onSuccess: () => table.resetRowSelection(),
      })
    } else {
      deactivateTaxes(selectedIds, {
        onSuccess: () => table.resetRowSelection(),
      })
    }
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='tax'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('active')}
              className='size-8'
              aria-label='Activate selected taxes'
              title='Activate selected taxes'
            >
              <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} />
              <span className='sr-only'>Activate selected taxes</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Activate selected taxes</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('inactive')}
              className='size-8'
              aria-label='Deactivate selected taxes'
              title='Deactivate selected taxes'
            >
              <HugeiconsIcon icon={UnavailableIcon} strokeWidth={2} />
              <span className='sr-only'>Deactivate selected taxes</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Deactivate selected taxes</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label='Delete selected taxes'
              title='Delete selected taxes'
            >
              <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
              <span className='sr-only'>Delete selected taxes</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete selected taxes</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <TaxesMultiDeleteDialog
        table={table}
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      />
    </>
  )
}