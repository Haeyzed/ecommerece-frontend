'use client'

import { CitiesViewDialog } from './cities-view-dialog'
import { useCities } from './cities-provider'
import { useAuthSession } from '@/features/auth/api'

export function CitiesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCities()
  const { data: session } = useAuthSession()

  const userPermissions = session?.user?.user_permissions ?? []

  const canView = userPermissions.includes('view cities')

  return (
    <>
      {currentRow && canView && (
        <CitiesViewDialog
          key={`city-view-${currentRow.id}`}
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
