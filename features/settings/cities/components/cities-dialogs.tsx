'use client'

import { CitiesActionDialog } from './cities-action-dialog'
import { CitiesDeleteDialog } from './cities-delete-dialog'
import { CitiesExportDialog } from './cities-export-dialog'
import { CitiesImportDialog } from './cities-import-dialog'
import { CitiesViewDialog } from './cities-view-dialog'
import { useCities } from './cities-provider'
import { useAuthSession } from '@/features/auth/api'

export function CitiesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCities()
  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []
  const canCreate = userPermissions.includes('create cities')
  const canImport = userPermissions.includes('import cities')
  const canExport = userPermissions.includes('export cities')
  const canUpdate = userPermissions.includes('update cities')
  const canDelete = userPermissions.includes('delete cities')
  const canView = userPermissions.includes('view cities')

  return (
    <>
      {canCreate && (
        <CitiesActionDialog
          key='city-add'
          open={open === 'add'}
          onOpenChange={(isOpen) => {
            if (!isOpen) setOpen(null)
          }}
        />
      )}

      {canImport && (
        <CitiesImportDialog
          key='city-import'
          open={open === 'import'}
          onOpenChange={(isOpen) => {
            if (!isOpen) setOpen(null)
          }}
        />
      )}

      {canExport && (
        <CitiesExportDialog
          key='city-export'
          open={open === 'export'}
          onOpenChange={(state) => setOpen(state ? 'export' : null)}
          ids={[]}
        />
      )}

      {currentRow && (
        <>
          {canUpdate && (
            <CitiesActionDialog
              key={`city-edit-${currentRow.id}`}
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
            <CitiesViewDialog
              key={`city-view-${currentRow.id}`}
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
            <CitiesDeleteDialog
              key={`city-delete-${currentRow.id}`}
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