'use client'

import { LeaveTypesActionDialog } from '@/features/hrm/leave-types'
import { LeaveTypesDeleteDialog } from '@/features/hrm/leave-types'
import { LeaveTypesExportDialog } from '@/features/hrm/leave-types'
import { LeaveTypesImportDialog } from '@/features/hrm/leave-types'
import { LeaveTypesViewDialog } from './leave-types-view-dialog'
import { useLeaveTypes } from './leave-types-provider'
import { useAuthSession } from '@/features/auth/api'

export function LeaveTypesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useLeaveTypes()
  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []

  const canCreate = userPermissions.includes('create leave_types')
  const canImport = userPermissions.includes('import leave_types')
  const canExport = userPermissions.includes('export leave_types')
  const canUpdate = userPermissions.includes('update leave_types')
  const canDelete = userPermissions.includes('delete leave_types')
  const canView = userPermissions.includes('view leave_types')

  return (
    <>
      {canCreate && (
        <LeaveTypesActionDialog
          key='leave-type-add'
          open={open === 'add'}
          onOpenChange={(isOpen) => {
            if (!isOpen) setOpen(null)
          }}
        />
      )}

      {canImport && (
        <LeaveTypesImportDialog
          key='leave-type-import'
          open={open === 'import'}
          onOpenChange={(isOpen) => {
            if (!isOpen) setOpen(null)
          }}
        />
      )}

      {canExport && (
        <LeaveTypesExportDialog
          key='leave-type-export'
          open={open === 'export'}
          onOpenChange={(state) => setOpen(state ? 'export' : null)}
          ids={[]}
        />
      )}

      {currentRow && (
        <>
          {canUpdate && (
            <LeaveTypesActionDialog
              key={`leave-type-edit-${currentRow.id}`}
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
            <LeaveTypesViewDialog
              key={`leave-type-view-${currentRow.id}`}
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
            <LeaveTypesDeleteDialog
              key={`leave-type-delete-${currentRow.id}`}
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