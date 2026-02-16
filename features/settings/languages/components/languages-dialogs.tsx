'use client'

import { LanguagesViewDialog } from './languages-view-dialog'
import { useLanguages } from './languages-provider'
import { useAuthSession } from '@/features/auth/api'

export function LanguagesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useLanguages()
  const { data: session } = useAuthSession()

  const userPermissions = session?.user?.user_permissions ?? []

  const canView = userPermissions.includes('view languages')

  return (
    <>
      {currentRow && canView && (
        <LanguagesViewDialog
          key={`language-view-${currentRow.id}`}
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
