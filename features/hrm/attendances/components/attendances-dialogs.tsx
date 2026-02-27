'use client'

import { AttendancesActionDialog } from '@/features/hrm/attendances'
import { AttendancesDeleteDialog } from '@/features/hrm/attendances'
import { AttendancesExportDialog } from '@/features/hrm/attendances'
import { AttendancesImportDialog } from '@/features/hrm/attendances'
import { AttendancesViewDialog } from '@/features/hrm/attendances'
import { useAttendances } from '@/features/hrm/attendances'
import { useAuthSession } from '@/features/auth/api'

export function AttendancesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useAttendances()
  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []

  const canCreate = userPermissions.includes('create attendances')
  const canImport = userPermissions.includes('import attendances')
  const canExport = userPermissions.includes('export attendances')
  const canUpdate = userPermissions.includes('update attendances')
  const canDelete = userPermissions.includes('delete attendances')
  const canView = userPermissions.includes('view attendances')

  return (
    <>
      {canCreate && (
        <AttendancesActionDialog
          key='attendance-add'
          open={open === 'add'}
          onOpenChange={(isOpen) => {
            if (!isOpen) setOpen(null)
          }}
        />
      )}

      {canImport && (
        <AttendancesImportDialog
          key='attendance-import'
          open={open === 'import'}
          onOpenChange={(isOpen) => {
            if (!isOpen) setOpen(null)
          }}
        />
      )}

      {canExport && (
        <AttendancesExportDialog
          key='attendance-export'
          open={open === 'export'}
          onOpenChange={(state) => setOpen(state ? 'export' : null)}
          ids={[]}
        />
      )}

      {currentRow && (
        <>
          {canUpdate && (
            <AttendancesActionDialog
              key={`attendance-edit-${currentRow.id}`}
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
            <AttendancesViewDialog
              key={`attendance-view-${currentRow.id}`}
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
            <AttendancesDeleteDialog
              key={`attendance-delete-${currentRow.id}`}
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