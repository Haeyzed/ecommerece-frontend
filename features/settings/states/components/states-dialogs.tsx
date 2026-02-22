'use client'

import { StatesActionDialog } from './states-action-dialog'
import { StatesDeleteDialog } from './states-delete-dialog'
import { StatesExportDialog } from './states-export-dialog'
import { StatesImportDialog } from './states-import-dialog'
import { StatesViewDialog } from './states-view-dialog'
import { useStates } from './states-provider'
import { useAuthSession } from '@/features/auth/api'

export function StatesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useStates()
  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []
  const canCreate = userPermissions.includes('create states')
  const canImport = userPermissions.includes('import states')
  const canExport = userPermissions.includes('export states')
  const canUpdate = userPermissions.includes('update states')
  const canDelete = userPermissions.includes('delete states')
  const canView = userPermissions.includes('view states')

  return (
    <>
      {canCreate && (
        <StatesActionDialog
          key='state-add'
          open={open === 'add'}
          onOpenChange={(isOpen) => {
            if (!isOpen) setOpen(null)
          }}
        />
      )}

      {canImport && (
        <StatesImportDialog
          key='state-import'
          open={open === 'import'}
          onOpenChange={(isOpen) => {
            if (!isOpen) setOpen(null)
          }}
        />
      )}

      {canExport && (
        <StatesExportDialog
          key='state-export'
          open={open === 'export'}
          onOpenChange={(state) => setOpen(state ? 'export' : null)}
          ids={[]}
        />
      )}

      {currentRow && (
        <>
          {canUpdate && (
            <StatesActionDialog
              key={`state-edit-${currentRow.id}`}
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
            <StatesViewDialog
              key={`state-view-${currentRow.id}`}
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
            <StatesDeleteDialog
              key={`state-delete-${currentRow.id}`}
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