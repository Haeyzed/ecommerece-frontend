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

  const userPermissions = session?.user?.user_permissions ?? []

  const canCreate = userPermissions.includes('warehouses-create')
  const canImport = userPermissions.includes('warehouses-import')
  const canExport = userPermissions.includes('warehouses-export')
  const canUpdate = userPermissions.includes('warehouses-update')
  const canDelete = userPermissions.includes('warehouses-delete')
  const canView = userPermissions.includes('warehouses-index')

  return (
    <>
      {canCreate && (
        <WarehousesActionDialog
          key='warehouse-add'
          open={open === 'add'}
          onOpenChange={() => setOpen('add')}
        />
      )}

      {canImport && (
        <WarehousesImportDialog
          key='warehouse-import'
          open={open === 'import'}
          onOpenChange={() => setOpen('import')}
        />
      )}

      {canExport && (
        <WarehousesExportDialog
          key='warehouse-export'
          open={open === 'export'}
          onOpenChange={(isOpen) => {
            if (!isOpen) setOpen(null)
          }}
          ids={[]}
        />
      )}

      {currentRow && (
        <>
          {canUpdate && (
            <WarehousesActionDialog
              key={`warehouse-edit-${currentRow.id}`}
              open={open === 'edit'}
              onOpenChange={() => {
                setOpen('edit')
                setTimeout(() => setCurrentRow(null), 500)
              }}
              currentRow={currentRow}
            />
          )}

          {canView && (
            <WarehousesViewDialog
              key={`warehouse-view-${currentRow.id}`}
              open={open === 'view'}
              onOpenChange={() => {
                setOpen('view')
                setTimeout(() => setCurrentRow(null), 500)
              }}
              currentRow={currentRow}
            />
          )}

          {canDelete && (
            <WarehousesDeleteDialog
              key={`warehouse-delete-${currentRow.id}`}
              open={open === 'delete'}
              onOpenChange={() => {
                setOpen('delete')
                setTimeout(() => setCurrentRow(null), 500)
              }}
              currentRow={currentRow}
            />
          )}
        </>
      )}
    </>
  )
}
