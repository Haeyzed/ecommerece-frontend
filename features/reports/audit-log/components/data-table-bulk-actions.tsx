'use client'

import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Upload01Icon } from '@hugeicons/core-free-icons'
import { type Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { useAuthSession } from '@/features/auth/api'
import { AuditLogExportDialog } from './audit-log-export-dialog'
import type { Audit } from '@/features/reports/audit-log/types'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({ table }: DataTableBulkActionsProps<TData>) {
  const [showExportDialog, setShowExportDialog] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedIds = selectedRows.map((row) => (row.original as Audit).id)
  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions ?? []
  const canExport = userPermissions.includes('audit-logs-export')

  if (!canExport) return null

  return (
    <>
      <BulkActionsToolbar table={table} entityName="audit">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowExportDialog(true)}
              className="size-8"
              aria-label="Export selected audits"
              title="Export selected audits"
            >
              <HugeiconsIcon icon={Upload01Icon} strokeWidth={2} />
              <span className="sr-only">Export selected audits</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Export selected audits</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <AuditLogExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        ids={selectedIds}
      />
    </>
  )
}
