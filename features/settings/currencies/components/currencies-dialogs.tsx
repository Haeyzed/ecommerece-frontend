'use client'

import { CurrenciesActionDialog } from './currencies-action-dialog'
import { CurrenciesDeleteDialog } from './currencies-delete-dialog'
import { CurrenciesExportDialog } from './currencies-export-dialog'
import { CurrenciesImportDialog } from './currencies-import-dialog'
import { CurrenciesViewDialog } from './currencies-view-dialog' // Generates separately, assume present
import { useCurrencies } from './currencies-provider'
import { useAuthSession } from '@/features/auth/api'

export function CurrenciesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCurrencies()
  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []
  const canCreate = userPermissions.includes('create currencies')
  const canImport = userPermissions.includes('import currencies')
  const canExport = userPermissions.includes('export currencies')
  const canUpdate = userPermissions.includes('update currencies')
  const canDelete = userPermissions.includes('delete currencies')
  const canView = userPermissions.includes('view currencies')

  return (
    <>
      {canCreate && (
        <CurrenciesActionDialog
          key='currency-add'
          open={open === 'add'}
          onOpenChange={(isOpen) => {
            if (!isOpen) setOpen(null)
          }}
        />
      )}

      {canImport && (
        <CurrenciesImportDialog
          key='currency-import'
          open={open === 'import'}
          onOpenChange={(isOpen) => {
            if (!isOpen) setOpen(null)
          }}
        />
      )}

      {canExport && (
        <CurrenciesExportDialog
          key='currency-export'
          open={open === 'export'}
          onOpenChange={(state) => setOpen(state ? 'export' : null)}
          ids={[]}
        />
      )}

      {currentRow && (
        <>
          {canUpdate && (
            <CurrenciesActionDialog
              key={`currency-edit-${currentRow.id}`}
              open={open === 'edit'}
              onOpenChange={(isOpen) => {
                if (!isOpen) {
                  setOpen(null)
                  setTimeout(() => {
                    setCurrentRow(null)
                  }, 500)
                }
              }}
              currentRow={currentRow}
            />
          )}

          {canView && (
            <CurrenciesViewDialog
              key={`currency-view-${currentRow.id}`}
              open={open === 'view'}
              onOpenChange={(isOpen) => {
                if (!isOpen) {
                  setOpen(null)
                  setTimeout(() => {
                    setCurrentRow(null)
                  }, 500)
                }
              }}
              currentRow={currentRow}
            />
          )}

          {canDelete && (
            <CurrenciesDeleteDialog
              key={`currency-delete-${currentRow.id}`}
              open={open === 'delete'}
              onOpenChange={(isOpen) => {
                if (!isOpen) {
                  setOpen(null)
                  setTimeout(() => {
                    setCurrentRow(null)
                  }, 500)
                }
              }}
              currentRow={currentRow}
            />
          )}
        </>
      )}
    </>
  )
}