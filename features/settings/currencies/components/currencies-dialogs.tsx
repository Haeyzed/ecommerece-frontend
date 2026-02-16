'use client'

import { CurrenciesViewDialog } from './currencies-view-dialog'
import { useCurrencies } from './currencies-provider'
import { useAuthSession } from '@/features/auth/api'

export function CurrenciesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCurrencies()
  const { data: session } = useAuthSession()

  const userPermissions = session?.user?.user_permissions ?? []

  const canView = userPermissions.includes('view currencies')

  return (
    <>
      {currentRow && canView && (
        <CurrenciesViewDialog
          key={`currency-view-${currentRow.id}`}
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
