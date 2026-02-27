'use client'

import { OvertimesActionDialog } from '@/features/hrm/overtimes'
import { OvertimesDeleteDialog } from '@/features/hrm/overtimes'
import { OvertimesExportDialog } from '@/features/hrm/overtimes'
import { OvertimesImportDialog } from '@/features/hrm/overtimes'
import { OvertimesViewDialog } from '@/features/hrm/overtimes'
import { useOvertimes } from '@/features/hrm/overtimes'
import { useAuthSession } from '@/features/auth/api'

export function OvertimesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useOvertimes()
  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []

  const canCreate = userPermissions.includes('create overtimes')
  const canImport = userPermissions.includes('import overtimes')
  const canExport = userPermissions.includes('export overtimes')
  const canUpdate = userPermissions.includes('update overtimes')
  const canDelete = userPermissions.includes('delete overtimes')
  const canView = userPermissions.includes('view overtimes')

  return (
    <>
      {canCreate && (
        <OvertimesActionDialog
          key='overtime-add'
          open={open === 'add'}
          onOpenChange={(isOpen) => {
            if (!isOpen) setOpen(null)
          }}
        />
      )}

      {canImport && (
        <OvertimesImportDialog
          key='overtime-import'
          open={open === 'import'}
          onOpenChange={(isOpen) => {
            if (!isOpen) setOpen(null)
          }}
        />
      )}

      {canExport && (
        <OvertimesExportDialog
          key='overtime-export'
          open={open === 'export'}
          onOpenChange={(state) => setOpen(state ? 'export' : null)}
          ids={[]}
        />
      )}

      {currentRow && (
        <>
          {canUpdate && (
            <OvertimesActionDialog
              key={`overtime-edit-${currentRow.id}`}
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
            <OvertimesViewDialog
              key={`overtime-view-${currentRow.id}`}
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
            <OvertimesDeleteDialog
              key={`overtime-delete-${currentRow.id}`}
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