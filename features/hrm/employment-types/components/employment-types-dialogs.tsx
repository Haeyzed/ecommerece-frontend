'use client'

import { useAuthSession } from '@/features/auth/api'
import {
  EmploymentTypesActionDialog,
  EmploymentTypesDeleteDialog,
  EmploymentTypesExportDialog,
  EmploymentTypesImportDialog,
} from '@/features/hrm/employment-types'

import { useEmploymentTypes } from './employment-types-provider'
import { EmploymentTypesViewDialog } from './employment-types-view-dialog'

export function EmploymentTypesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useEmploymentTypes()
  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []

  const canCreate = userPermissions.includes('create employment types')
  const canImport = userPermissions.includes('import employment types')
  const canExport = userPermissions.includes('export employment types')
  const canUpdate = userPermissions.includes('update employment types')
  const canDelete = userPermissions.includes('delete employment types')
  const canView = userPermissions.includes('view employment types')

  return (
    <>
      {canCreate && (
        <EmploymentTypesActionDialog
          key='employment-type-add'
          open={open === 'add'}
          onOpenChange={(isOpen) => {
            if (!isOpen) setOpen(null)
          }}
        />
      )}

      {canImport && (
        <EmploymentTypesImportDialog
          key='employment-type-import'
          open={open === 'import'}
          onOpenChange={(isOpen) => {
            if (!isOpen) setOpen(null)
          }}
        />
      )}

      {canExport && (
        <EmploymentTypesExportDialog
          key='employment-type-export'
          open={open === 'export'}
          onOpenChange={(state) => setOpen(state ? 'export' : null)}
          ids={[]}
        />
      )}

      {currentRow && (
        <>
          {canUpdate && (
            <EmploymentTypesActionDialog
              key={`employment-type-edit-${currentRow.id}`}
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
            <EmploymentTypesViewDialog
              key={`employment-type-view-${currentRow.id}`}
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
            <EmploymentTypesDeleteDialog
              key={`employment-type-delete-${currentRow.id}`}
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
