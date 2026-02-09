'use client'

/**
 * ActivityLogDialogs
 *
 * Orchestrator component that renders the appropriate dialog (View)
 * based on the current state from the ActivityLogProvider.
 */

import { ActivityLogViewDialog } from './activity-log-view-dialog'
import { useActivityLog } from './activity-log-provider'
import { useAuthSession } from '@/features/auth/api'

export function ActivityLogDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useActivityLog()
  const { data: session } = useAuthSession()

  const userPermissions = session?.user?.user_permissions ?? []
  const canView = userPermissions.includes('activity-log-index')

  return (
    <>
      {currentRow && canView && (
        <ActivityLogViewDialog
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
