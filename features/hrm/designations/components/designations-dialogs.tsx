'use client'

import { DesignationsActionDialog } from '@/features/hrm/designations'
import { DesignationsDeleteDialog } from '@/features/hrm/designations'
import { DesignationsExportDialog } from '@/features/hrm/designations'
import { DesignationsImportDialog } from '@/features/hrm/designations'
import { DesignationsViewDialog } from './designations-view-dialog'
import { useDesignations } from './designations-provider'
import { useAuthSession } from '@/features/auth/api'

export function DesignationsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useDesignations()
  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []
  const canCreate = userPermissions.includes('create designations')
  const canImport = userPermissions.includes('import designations')
  const canExport = userPermissions.includes('export designations')
  const canUpdate = userPermissions.includes('update designations')
  const canDelete = userPermissions.includes('delete designations')
  const canView = userPermissions.includes('view designations')

  return (
    <>
      {canCreate && (
        <DesignationsActionDialog
          key='designation-add'
          open={open === 'add'}
          onOpenChange={(isOpen) => {
            if (!isOpen) setOpen(null)
          }}
        />
      )}

      {canImport && (
        <DesignationsImportDialog
          key='designation-import'
          open={open === 'import'}
          onOpenChange={(isOpen) => {
            if (!isOpen) setOpen(null)
          }}
        />
      )}

      {canExport && (
        <DesignationsExportDialog
          key='designation-export'
          open={open === 'export'}
          onOpenChange={(state) => setOpen(state ? 'export' : null)}
          ids={[]}
        />
      )}

      {currentRow && (
        <>
          {canUpdate && (
            <DesignationsActionDialog
              key={`designation-edit-${currentRow.id}`}
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
            <DesignationsViewDialog
              key={`designation-view-${currentRow.id}`}
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
            <DesignationsDeleteDialog
              key={`designation-delete-${currentRow.id}`}
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