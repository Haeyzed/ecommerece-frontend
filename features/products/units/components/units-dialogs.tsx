'use client'

/**
 * UnitsDialogs
 *
 * Orchestrator component that renders the appropriate dialog (Add, Edit, Delete, Import)
 * based on the current state from the UnitsProvider and User Permissions.
 *
 * @component
 */

import { UnitsActionDialog } from './units-action-dialog'
import { UnitsDeleteDialog } from './units-delete-dialog'
import { UnitsImportDialog } from './units-import-dialog'
import { UnitsViewDialog } from './units-view-dialog'
import { useUnits } from './units-provider'
import { useAuthSession } from '@/features/auth/api'

export function UnitsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useUnits()
  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []
  const canCreate = userPermissions.includes('units-create')
  const canImport = userPermissions.includes('units-import')
  const canUpdate = userPermissions.includes('units-update')
  const canDelete = userPermissions.includes('units-delete')
  const canView = userPermissions.includes('units-index')

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