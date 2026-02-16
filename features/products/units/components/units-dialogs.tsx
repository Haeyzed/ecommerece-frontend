'use client'

import { UnitsActionDialog } from './units-action-dialog'
import { UnitsDeleteDialog } from './units-delete-dialog'
import { UnitsExportDialog } from './units-export-dialog'
import { UnitsImportDialog } from './units-import-dialog'
import { UnitsViewDialog } from './units-view-dialog'
import { useUnits } from './units-provider'
import { useAuthSession } from '@/features/auth/api'

export function UnitsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useUnits()
  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []
  const canCreate = userPermissions.includes('create units')
  const canImport = userPermissions.includes('units-import')
  const canExport = userPermissions.includes('units-export')
  const canUpdate = userPermissions.includes('update units')
  const canDelete = userPermissions.includes('delete units')
  const canView = userPermissions.includes('view units')

  return (
    <>
      {canCreate && (
        <UnitsActionDialog
          key='unit-add'
          open={open === 'add'}
          onOpenChange={(isOpen) => {
            if (!isOpen) setOpen(null)
          }}
        />
      )}

      {canImport && (
        <UnitsImportDialog
          key='unit-import'
          open={open === 'import'}
          onOpenChange={(isOpen) => {
            if (!isOpen) setOpen(null)
          }}
        />
      )}

      {canExport && (
        <UnitsExportDialog
          key='unit-export'
          open={open === 'export'}
          onOpenChange={(state) => setOpen(state ? 'export' : null)}
          ids={[]}
        />
      )}

      {currentRow && (
        <>
          {canUpdate && (
            <UnitsActionDialog
              key={`unit-edit-${currentRow.id}`}
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
            <UnitsViewDialog
              key={`unit-view-${currentRow.id}`}
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
            <UnitsDeleteDialog
              key={`unit-delete-${currentRow.id}`}
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