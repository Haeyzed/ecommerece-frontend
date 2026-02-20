'use client'

import { DepartmentsActionDialog } from './departments-action-dialog'
import { DepartmentsDeleteDialog } from './departments-delete-dialog'
import { DepartmentsExportDialog } from './departments-export-dialog'
import { DepartmentsImportDialog } from './departments-import-dialog'
import { DepartmentsViewDialog } from './departments-view-dialog'
import { useDepartments } from './departments-provider'
import { useAuthSession } from '@/features/auth/api'

export function DepartmentsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useDepartments()
  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []
  const canCreate = userPermissions.includes('create departments')
  const canImport = userPermissions.includes('import departments')
  const canExport = userPermissions.includes('export departments')
  const canUpdate = userPermissions.includes('update departments')
  const canDelete = userPermissions.includes('delete departments')
  const canView = userPermissions.includes('view departments')

  return (
    <>
      {canCreate && (
        <DepartmentsActionDialog
          key='department-add'
          open={open === 'add'}
          onOpenChange={(isOpen) => {
            if (!isOpen) setOpen(null)
          }}
        />
      )}

      {canImport && (
        <DepartmentsImportDialog
          key='department-import'
          open={open === 'import'}
          onOpenChange={(isOpen) => {
            if (!isOpen) setOpen(null)
          }}
        />
      )}

      {canExport && (
        <DepartmentsExportDialog
          key='department-export'
          open={open === 'export'}
          onOpenChange={(state) => setOpen(state ? 'export' : null)}
          ids={[]}
        />
      )}

      {currentRow && (
        <>
          {canUpdate && (
            <DepartmentsActionDialog
              key={`department-edit-${currentRow.id}`}
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
            <DepartmentsViewDialog
              key={`department-view-${currentRow.id}`}
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
            <DepartmentsDeleteDialog
              key={`department-delete-${currentRow.id}`}
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