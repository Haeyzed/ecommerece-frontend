'use client'

import { StatesViewDialog } from './states-view-dialog'
import { useStates } from './states-provider'
import { useAuthSession } from '@/features/auth/api'

export function StatesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useStates()
  const { data: session } = useAuthSession()

  const userPermissions = session?.user?.user_permissions ?? []

  const canView = userPermissions.includes('view states')

  return (
    <>
      {currentRow && canView && (
        <StatesViewDialog
          key={`state-view-${currentRow.id}`}
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
