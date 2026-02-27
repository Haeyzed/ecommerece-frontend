'use client'

import { EmployeesActionDialog } from '@/features/hrm/employees'
import { EmployeesDeleteDialog } from '@/features/hrm/employees'
import { EmployeesExportDialog } from '@/features/hrm/employees'
import { EmployeesImportDialog } from '@/features/hrm/employees'
import { EmployeesViewDialog } from './employees-view-dialog'
import { EmployeesIdCardDialog } from './employees-id-card-dialog'
import { useEmployees } from './employees-provider'
import { useAuthSession } from '@/features/auth/api'
import { type Table } from '@tanstack/react-table'

type Props = {
  table?: Table<any>
}

export function EmployeesDialogs({ table }: Props = {}) {
  const { open, setOpen, currentRow, setCurrentRow } = useEmployees()
  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []

  const canCreate = userPermissions.includes('create employees')
  const canImport = userPermissions.includes('import employees')
  const canExport = userPermissions.includes('export employees')
  const canUpdate = userPermissions.includes('update employees')
  const canDelete = userPermissions.includes('delete employees')
  const canView = userPermissions.includes('view employees')

  // Extract selected rows for bulk printing
  const selectedRows = table ? table.getFilteredSelectedRowModel().rows.map((r) => r.original) : []

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

          {canView && (
            <EmployeesIdCardDialog
              key={`employee-id-card-${currentRow.id}`}
              open={open === 'id-card'}
              onOpenChange={(isOpen) => {
                if (!isOpen) {
                  setOpen(null)
                  setTimeout(() => {
                    setCurrentRow(null)
                  }, 500)
                }
              }}
              employees={[currentRow]}
            />
          )}
        </>
      )}

      {/* Bulk Print Dialog */}
      {canExport && selectedRows.length > 0 && (
        <EmployeesIdCardDialog
          key='employee-bulk-id-card'
          open={open === 'bulk-id-card'}
          onOpenChange={(isOpen) => {
            if (!isOpen) setOpen(null)
          }}
          employees={selectedRows}
        />
      )}
    </>
  )
}