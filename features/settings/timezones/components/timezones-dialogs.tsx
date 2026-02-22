'use client'

import { TimezonesActionDialog } from './timezones-action-dialog'
import { TimezonesDeleteDialog } from './timezones-delete-dialog'
import { TimezonesExportDialog } from './timezones-export-dialog'
import { TimezonesImportDialog } from './timezones-import-dialog'
import { TimezonesViewDialog } from './timezones-view-dialog'
import { useTimezones } from './timezones-provider'
import { useAuthSession } from '@/features/auth/api'

export function TimezonesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useTimezones()
  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []
  const canCreate = userPermissions.includes('create timezones')
  const canImport = userPermissions.includes('import timezones')
  const canExport = userPermissions.includes('export timezones')
  const canUpdate = userPermissions.includes('update timezones')
  const canDelete = userPermissions.includes('delete timezones')
  const canView = userPermissions.includes('view timezones')

  return (
    <>\n      {canCreate && (
      <TimezonesActionDialog
        key='timezone-add'
        open={open === 'add'}
        onOpenChange={(isOpen) => {
          if (!isOpen) setOpen(null)
        }}
      />
    )}

      {canImport && (
        <TimezonesImportDialog
          key='timezone-import'
          open={open === 'import'}
          onOpenChange={(isOpen) => {
            if (!isOpen) setOpen(null)
          }}
        />
      )}

      {canExport && (
        <TimezonesExportDialog
          key='timezone-export'
          open={open === 'export'}
          onOpenChange={(state) => setOpen(state ? 'export' : null)}
          ids={[]}
        />
      )}

      {currentRow && (
        <>
          {canUpdate && (
            <TimezonesActionDialog
              key={`timezone-edit-${currentRow.id}`}
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
            <TimezonesViewDialog
              key={`timezone-view-${currentRow.id}`}
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
            <TimezonesDeleteDialog
              key={`timezone-delete-${currentRow.id}`}
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