'use client'

import { TimezonesViewDialog } from './timezones-view-dialog'
import { useTimezones } from './timezones-provider'
import { useAuthSession } from '@/features/auth/api'

export function TimezonesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useTimezones()
  const { data: session } = useAuthSession()

  const userPermissions = session?.user?.user_permissions ?? []

  const canView = userPermissions.includes('view timezones')

  return (
    <>
      {currentRow && canView && (
        <TimezonesViewDialog
          key={`timezone-view-${currentRow.id}`}
          open={open === 'view'}
          onOpenChange={() => {
            setOpen('view')
            setTimeout(() => setCurrentRow(null), 500)
          }}
          currentRow={currentRow}
        />
      )}
    </>
  )
}
