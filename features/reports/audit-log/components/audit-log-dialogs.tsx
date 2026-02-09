'use client'

/**
 * AuditLogDialogs
 *
 * Orchestrator component that renders the appropriate dialog (View)
 * based on the current state from the AuditLogProvider.
 */

import { AuditLogViewDialog } from './audit-log-view-dialog'
import { useAuditLog } from './audit-log-provider'
import { useAuthSession } from '@/features/auth/api'

export function AuditLogDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useAuditLog()
  const { data: session } = useAuthSession()

  const userPermissions = session?.user?.user_permissions ?? []
  const canView = userPermissions.includes('activity-log-index')

  return (
    <>
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
