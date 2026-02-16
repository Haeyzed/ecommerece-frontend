'use client'

import { TaxesActionDialog } from './taxes-action-dialog'
import { TaxesDeleteDialog } from './taxes-delete-dialog'
import { TaxesExportDialog } from './taxes-export-dialog'
import { TaxesImportDialog } from './taxes-import-dialog'
import { TaxesViewDialog } from './taxes-view-dialog'
import { useTaxes } from './taxes-provider'
import { useAuthSession } from '@/features/auth/api'

export function TaxesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useTaxes()
  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []
  const canCreate = userPermissions.includes('create taxes')
  const canImport = userPermissions.includes('import taxes')
  const canExport = userPermissions.includes('export taxes')
  const canUpdate = userPermissions.includes('update taxes')
  const canDelete = userPermissions.includes('delete taxes')
  const canView = userPermissions.includes('view taxes')

  return (
    <>
      {canCreate && (
        <TaxesActionDialog
          key='tax-add'
          open={open === 'add'}
          onOpenChange={(isOpen) => {
            if (!isOpen) setOpen(null)
          }}
        />
      )}

      {canImport && (
        <TaxesImportDialog
          key='tax-import'
          open={open === 'import'}
          onOpenChange={(isOpen) => {
            if (!isOpen) setOpen(null)
          }}
        />
      )}

      {canExport && (
        <TaxesExportDialog
          key='tax-export'
          open={open === 'export'}
          onOpenChange={(state) => setOpen(state ? 'export' : null)}
          ids={[]}
        />
      )}

      {currentRow && (
        <>
          {canUpdate && (
            <TaxesActionDialog
              key={`tax-edit-${currentRow.id}`}
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
            <TaxesViewDialog
              key={`tax-view-${currentRow.id}`}
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
            <TaxesDeleteDialog
              key={`tax-delete-${currentRow.id}`}
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