'use client'

import { WarehousesActionDialog } from './warehouses-action-dialog'
import { WarehousesDeleteDialog } from './warehouses-delete-dialog'
import { WarehousesExportDialog } from './warehouses-export-dialog'
import { WarehousesImportDialog } from './warehouses-import-dialog'
import { WarehousesViewDialog } from './warehouses-view-dialog'
import { useWarehouses } from './warehouses-provider'
import { useAuthSession } from '@/features/auth/api'

export function WarehousesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useWarehouses()
  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []
  const canCreate = userPermissions.includes('create warehouses')
  const canImport = userPermissions.includes('import warehouses')
  const canExport = userPermissions.includes('export warehouses')
  const canUpdate = userPermissions.includes('update warehouses')
  const canDelete = userPermissions.includes('delete warehouses')
  const canView = userPermissions.includes('view warehouses')

  return (
    <>
      {canCreate && (
        <WarehousesActionDialog
          key='warehouse-add'
          open={open === 'add'}
          onOpenChange={(isOpen) => {
            if (!isOpen) setOpen(null)
          }}
        />
      )}

      {canImport && (
        <WarehousesImportDialog
          key='warehouse-import'
          open={open === 'import'}
          onOpenChange={(isOpen) => {
            if (!isOpen) setOpen(null)
          }}
        />
      )}

      {canExport && (
        <WarehousesExportDialog
          key='warehouse-export'
          open={open === 'export'}
          onOpenChange={(state) => setOpen(state ? 'export' : null)}
          ids={[]}
        />
      )}

      {currentRow && (
        <>
          {canUpdate && (
            <WarehousesActionDialog
              key={`warehouse-edit-${currentRow.id}`}
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
            <WarehousesViewDialog
              key={`warehouse-view-${currentRow.id}`}
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
            <WarehousesDeleteDialog
              key={`warehouse-delete-${currentRow.id}`}
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