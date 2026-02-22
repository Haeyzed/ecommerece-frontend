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
import { type Timezone } from '../types'
import { TimezonesExportDialog } from './timezones-export-dialog'
import { TimezonesMultiDeleteDialog } from './timezones-multi-delete-dialog'
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
  const selectedIds = selectedRows.map((row) => (row.original as Timezone).id)

  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []

  const canDelete = userPermissions.includes('delete timezones')
  const canExport = userPermissions.includes('export timezones')

  if (!canDelete && !canExport) return null

  return (
    <>
      <BulkActionsToolbar table={table} entityName='timezone'>
        {canExport && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='outline'
                size='icon'
                onClick={() => setShowExportDialog(true)}
                className='size-8'
                aria-label='Export selected timezones'
                title='Export selected timezones'
              >
                <HugeiconsIcon icon={Upload01Icon} strokeWidth={2} />
                <span className='sr-only'>Export selected timezones</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Export selected timezones</p>
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
                aria-label='Delete selected timezones'
                title='Delete selected timezones'
              >
                <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                <span className='sr-only'>Delete selected timezones</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete selected timezones</p>
            </TooltipContent>
          </Tooltip>
        )}
      </BulkActionsToolbar>

      {canDelete && (
        <TimezonesMultiDeleteDialog
          table={table}
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
        />
      )}

      {canExport && (
        <TimezonesExportDialog
          open={showExportDialog}
          onOpenChange={setShowExportDialog}
          ids={selectedIds}
        />
      )}
    </>
  )
}