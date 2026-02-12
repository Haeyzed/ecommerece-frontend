'use client'

import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Delete02Icon, Upload01Icon } from '@hugeicons/core-free-icons'
import type { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import type { Supplier } from '../schemas'
import { SuppliersExportDialog } from './suppliers-export-dialog'
import { SuppliersMultiDeleteDialog } from './suppliers-multi-delete-dialog'
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
  const selectedIds = selectedRows.map((row) => (row.original as Supplier).id)
  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []
  const canDelete = userPermissions.includes('suppliers-delete')
  const canExport = userPermissions.includes('suppliers-export')

  if (!canDelete && !canExport) return null

  return (
    <>
      <BulkActionsToolbar table={table} entityName="supplier">
        {canExport && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowExportDialog(true)}
                className="size-8"
                aria-label="Export selected suppliers"
                title="Export selected suppliers"
              >
                <HugeiconsIcon icon={Upload01Icon} strokeWidth={2} />
                <span className="sr-only">Export selected suppliers</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Export selected suppliers</p>
            </TooltipContent>
          </Tooltip>
        )}

        {canDelete && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => setShowDeleteConfirm(true)}
                className="size-8"
                aria-label="Delete selected suppliers"
                title="Delete selected suppliers"
              >
                <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                <span className="sr-only">Delete selected suppliers</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete selected suppliers</p>
            </TooltipContent>
          </Tooltip>
        )}
      </BulkActionsToolbar>

      {canDelete && (
        <SuppliersMultiDeleteDialog
          table={table}
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
        />
      )}

      {canExport && (
        <SuppliersExportDialog
          open={showExportDialog}
          onOpenChange={setShowExportDialog}
          ids={selectedIds}
        />
      )}
    </>
  )
}
