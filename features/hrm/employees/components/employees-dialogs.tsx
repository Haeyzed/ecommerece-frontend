'use client'

import { EmployeesActionDialog } from '@/features/hrm/employees'
import { EmployeesDeleteDialog } from '@/features/hrm/employees'
import { EmployeesExportDialog } from '@/features/hrm/employees'
import { EmployeesImportDialog } from '@/features/hrm/employees'
import { EmployeesViewDialog } from './employees-view-dialog'
import { useEmployees } from './employees-provider'
import { useAuthSession } from '@/features/auth/api'

export function EmployeesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useEmployees()
  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []
  const canCreate = userPermissions.includes('create employees')
  const canImport = userPermissions.includes('import employees')
  const canExport = userPermissions.includes('export employees')
  const canUpdate = userPermissions.includes('update employees')
  const canDelete = userPermissions.includes('delete employees')
  const canView = userPermissions.includes('view employees')

  return (
    <>
      {canCreate && (
        <EmployeesActionDialog
          key='employee-add'
          open={open === 'add'}
          onOpenChange={(isOpen) => {
            if (!isOpen) setOpen(null)
          }}
        />
      )}

      {canImport && (
        <EmployeesImportDialog
          key='employee-import'
          open={open === 'import'}
          onOpenChange={(isOpen) => {
            if (!isOpen) setOpen(null)
          }}
        />
      )}

      {canExport && (
        <EmployeesExportDialog
          key='employee-export'
          open={open === 'export'}
          onOpenChange={(state) => setOpen(state ? 'export' : null)}
          ids={[]}
        />
      )}

      {currentRow && (
        <>
          {canUpdate && (
            <EmployeesActionDialog
              key={`employee-edit-${currentRow.id}`}
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
            <EmployeesViewDialog
              key={`employee-view-${currentRow.id}`}
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
            <EmployeesDeleteDialog
              key={`employee-delete-${currentRow.id}`}
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