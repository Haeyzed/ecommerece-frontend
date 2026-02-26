'use client'

import { ShiftsActionDialog } from '@/features/hrm/shifts'
import { ShiftsDeleteDialog } from '@/features/hrm/shifts'
import { ShiftsExportDialog } from '@/features/hrm/shifts'
import { ShiftsImportDialog } from '@/features/hrm/shifts'
import { ShiftsViewDialog } from '@/features/hrm/shifts'
import { useShifts } from '@/features/hrm/shifts'
import { useAuthSession } from '@/features/auth/api'

export function ShiftsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useShifts()
  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []

  const canCreate = userPermissions.includes('create shifts')
  const canImport = userPermissions.includes('import shifts')
  const canExport = userPermissions.includes('export shifts')
  const canUpdate = userPermissions.includes('update shifts')
  const canDelete = userPermissions.includes('delete shifts')
  const canView = userPermissions.includes('view shifts')

  return (
    <>
      {canCreate && (
        <ShiftsActionDialog
          key='shift-add'
          open={open === 'add'}
          onOpenChange={(isOpen) => {
            if (!isOpen) setOpen(null)
          }}
        />
      )}

      {canImport && (
        <ShiftsImportDialog
          key='shift-import'
          open={open === 'import'}
          onOpenChange={(isOpen) => {
            if (!isOpen) setOpen(null)
          }}
        />
      )}

      {canExport && (
        <ShiftsExportDialog
          key='shift-export'
          open={open === 'export'}
          onOpenChange={(state) => setOpen(state ? 'export' : null)}
          ids={[]}
        />
      )}

      {currentRow && (
        <>
          {canUpdate && (
            <ShiftsActionDialog
              key={`shift-edit-${currentRow.id}`}
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
            <ShiftsViewDialog
              key={`shift-view-${currentRow.id}`}
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
            <ShiftsDeleteDialog
              key={`shift-delete-${currentRow.id}`}
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