'use client'

import { CountriesActionDialog } from './countries-action-dialog'
import { CountriesDeleteDialog } from './countries-delete-dialog'
import { CountriesExportDialog } from './countries-export-dialog'
import { CountriesImportDialog } from './countries-import-dialog'
import { CountriesViewDialog } from './countries-view-dialog'
import { useCountries } from './countries-provider'
import { useAuthSession } from '@/features/auth/api'

export function CountriesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCountries()
  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []
  const canCreate = userPermissions.includes('create countries')
  const canImport = userPermissions.includes('import countries')
  const canExport = userPermissions.includes('export countries')
  const canUpdate = userPermissions.includes('update countries')
  const canDelete = userPermissions.includes('delete countries')
  const canView = userPermissions.includes('view countries')

  return (
    <>
      {canCreate && (
        <CountriesActionDialog
          key='country-add'
          open={open === 'add'}
          onOpenChange={(isOpen) => {
            if (!isOpen) setOpen(null)
          }}
        />
      )}

      {canImport && (
        <CountriesImportDialog
          key='country-import'
          open={open === 'import'}
          onOpenChange={(isOpen) => {
            if (!isOpen) setOpen(null)
          }}
        />
      )}

      {canExport && (
        <CountriesExportDialog
          key='country-export'
          open={open === 'export'}
          onOpenChange={(state) => setOpen(state ? 'export' : null)}
          ids={[]}
        />
      )}

      {currentRow && (
        <>
          {canUpdate && (
            <CountriesActionDialog
              key={`country-edit-${currentRow.id}`}
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
            <CountriesViewDialog
              key={`country-view-${currentRow.id}`}
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
            <CountriesDeleteDialog
              key={`country-delete-${currentRow.id}`}
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