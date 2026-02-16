'use client'

import { CountriesViewDialog } from './countries-view-dialog'
import { useCountries } from './countries-provider'
import { useAuthSession } from '@/features/auth/api'

export function CountriesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCountries()
  const { data: session } = useAuthSession()

  const userPermissions = session?.user?.user_permissions ?? []

  const canView = userPermissions.includes('view countries')

  return (
    <>
      {currentRow && canView && (
        <CountriesViewDialog
          key={`country-view-${currentRow.id}`}
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
