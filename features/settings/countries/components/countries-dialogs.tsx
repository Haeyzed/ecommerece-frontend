'use client'

import { CountriesViewDialog } from './countries-view-dialog'
import { useCountries } from './countries-provider'
import { useAuthSession } from '@/features/auth/api'

export function CountriesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCountries()
  const canView = (useAuthSession().data?.user?.user_permissions ?? []).includes('view countries')

  return (
    <>
      {currentRow && canView && (
        <CountriesViewDialog
          key={`country-view-${currentRow.id}`}
          open={open === 'view'}
          onOpenChange={() => { setOpen('view'); setTimeout(() => setCurrentRow(null), 500) }}
          currentRow={currentRow}
        />
      )}
    </>
  )
}
