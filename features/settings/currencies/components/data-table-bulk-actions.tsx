'use client'

import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Delete02Icon,
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
import { type Currency } from '../types'
import { CurrenciesExportDialog } from './currencies-export-dialog'
import { CurrenciesMultiDeleteDialog } from './currencies-multi-delete-dialog'
import { useAuthSession } from '@/features/auth/api'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
                                              table,
                                            }: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedIds = selectedRows.map((row) => (row.original as Currency).id)

  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []

  const canDelete = userPermissions.includes('delete currencies')
  const canExport = userPermissions.includes('export currencies')

  if (!canDelete && !canExport) return null

  return (
    <>
      <BulkActionsToolbar table={table} entityName='currency'>
        {canExport && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='outline'
                size='icon'
                onClick={() => setShowExportDialog(true)}
                className='size-8'
                aria-label='Export selected currencies'
                title='Export selected currencies'
              >
                <HugeiconsIcon icon={Upload01Icon} strokeWidth={2} />
                <span className='sr-only'>Export selected currencies</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Export selected currencies</p>
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
                className='size-8'
                aria-label='Delete selected currencies'
                title='Delete selected currencies'
              >
                <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                <span className='sr-only'>Delete selected currencies</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete selected currencies</p>
            </TooltipContent>
          </Tooltip>
        )}
      </BulkActionsToolbar>

      {canDelete && (
        <CurrenciesMultiDeleteDialog
          table={table}
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
        />
      )}

      {canExport && (
        <CurrenciesExportDialog
          open={showExportDialog}
          onOpenChange={setShowExportDialog}
          ids={selectedIds}
        />
      )}
    </>
  )
}