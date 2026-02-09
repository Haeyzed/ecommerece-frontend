'use client'

/**
 * AuditLogDialogs
 *
 * Orchestrator component that renders the appropriate dialog (View, Export)
 * based on the current state from the AuditLogProvider.
 */

import { AuditLogExportDialog } from './audit-log-export-dialog'
import { AuditLogViewDialog } from './audit-log-view-dialog'
import { useAuditLog } from './audit-log-provider'
import { useAuthSession } from '@/features/auth/api'

export function AuditLogDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useAuditLog()
  const { data: session } = useAuthSession()

  const userPermissions = session?.user?.user_permissions ?? []
  const canView = userPermissions.includes('audit-logs-index')
  const canExport = userPermissions.includes('audit-logs-export')

  return (
    <>
      {canExport && (
        <AuditLogExportDialog
          key="audit-log-export"
          open={open === 'export'}
          onOpenChange={(state) => setOpen(state ? 'export' : null)}
          ids={[]}
        />
      )}

      {currentRow && canView && (
        <AuditLogViewDialog
          key={`audit-view-${currentRow.id}`}
          open={open === 'view'}
          onOpenChange={() => {
            setOpen('view')
            setTimeout(() => {
              setCurrentRow(null)
            }, 500)
          }}
          currentRow={currentRow}
        />
      )}
    </>
  )
}
