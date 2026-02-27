'use client'

import { LeavesActionDialog } from '@/features/hrm/leaves'
import { LeavesDeleteDialog } from '@/features/hrm/leaves'
import { LeavesExportDialog } from '@/features/hrm/leaves'
import { LeavesImportDialog } from '@/features/hrm/leaves'
import { LeavesViewDialog } from '@/features/hrm/leaves'
import { useLeaves } from '@/features/hrm/leaves'
import { useAuthSession } from '@/features/auth/api'

export function LeavesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useLeaves()
  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []

  const canCreate = userPermissions.includes('create leaves')
  const canImport = userPermissions.includes('import leaves')
  const canExport = userPermissions.includes('export leaves')
  const canUpdate = userPermissions.includes('update leaves')
  const canDelete = userPermissions.includes('delete leaves')
  const canView = userPermissions.includes('view leaves')

  return (
    <>
      {canCreate && (
        <LeavesActionDialog
          key='leave-add'
          open={open === 'add'}
          onOpenChange={(isOpen) => {
            if (!isOpen) setOpen(null)
          }}
        />
      )}

      {canImport && (
        <LeavesImportDialog
          key='leave-import'
          open={open === 'import'}
          onOpenChange={(isOpen) => {
            if (!isOpen) setOpen(null)
          }}
        />
      )}

      {canExport && (
        <LeavesExportDialog
          key='leave-export'
          open={open === 'export'}
          onOpenChange={(state) => setOpen(state ? 'export' : null)}
          ids={[]}
        />
      )}

      {currentRow && (
        <>
          {canUpdate && (
            <LeavesActionDialog
              key={`leave-edit-${currentRow.id}`}
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
            <LeavesViewDialog
              key={`leave-view-${currentRow.id}`}
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
            <LeavesDeleteDialog
              key={`leave-delete-${currentRow.id}`}
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