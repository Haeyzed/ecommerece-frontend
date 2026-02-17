'use client'

import { useCustomersContext } from './customers-provider'
import { useAuthSession } from '@/features/auth/api'
import { CustomersActionDialog } from './customers-action-dialog'
import { CustomersAddDepositDialog } from './customers-add-deposit-dialog'
import { CustomersDeleteDialog } from './customers-delete-dialog'
import { CustomersExportDialog } from './customers-export-dialog'
import { CustomersImportDialog } from './customers-import-dialog'
import { CustomersViewDialog } from './customers-view-dialog'
import { CustomersViewDepositDialog } from './customers-view-deposit-dialog'

export function CustomersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCustomersContext()
  const { data: session } = useAuthSession()

  const userPermissions = session?.user?.user_permissions || []
  const canCreate = userPermissions.includes('create customers')
  const canImport = userPermissions.includes('import customers')
  const canExport = userPermissions.includes('export customers')
  const canUpdate = userPermissions.includes('update customers')
  const canDelete = userPermissions.includes('delete customers')
  const canView = userPermissions.includes('view customer details')

  return (
    <>
      {canCreate && (
        <CustomersActionDialog
          key="customer-add"
          open={open === 'add'}
          onOpenChange={(value) => setOpen(value ? 'add' : null)}
        />
      )}

      {canImport && (
        <CustomersImportDialog
          key="customer-import"
          open={open === 'import'}
          onOpenChange={(value) => setOpen(value ? 'import' : null)}
        />
      )}

      {canExport && (
        <CustomersExportDialog
          key="customer-export"
          open={open === 'export'}
          onOpenChange={(state) => setOpen(state ? 'export' : null)}
          ids={[]}
        />
      )}

      {currentRow && (
        <>
          {canUpdate && (
            <CustomersActionDialog
              key={`customer-edit-${currentRow.id}`}
              open={open === 'edit'}
              onOpenChange={(value) => {
                if (!value) setTimeout(() => setCurrentRow(null), 500)
                setOpen(value ? 'edit' : null)
              }}
              currentRow={currentRow}
            />
          )}

          {canView && (
            <CustomersViewDialog
              key={`customer-view-${currentRow.id}`}
              open={open === 'view'}
              onOpenChange={(value) => {
                if (!value) setTimeout(() => setCurrentRow(null), 500)
                setOpen(value ? 'view' : null)
              }}
              currentRow={currentRow}
            />
          )}

          {canDelete && (
            <CustomersDeleteDialog
              key={`customer-delete-${currentRow.id}`}
              open={open === 'delete'}
              onOpenChange={(value) => {
                if (!value) setTimeout(() => setCurrentRow(null), 500)
                setOpen(value ? 'delete' : null)
              }}
              currentRow={currentRow}
            />
          )}

          {open === 'add-deposit' && (
            <CustomersAddDepositDialog
              open={true}
              onOpenChange={(state) => {
                if (!state) {
                  setOpen(null)
                  setTimeout(() => setCurrentRow(null), 300)
                }
              }}
              customer={currentRow}
            />
          )}

          {open === 'view-deposit' && (
            <CustomersViewDepositDialog
              open={true}
              onOpenChange={(state) => {
                if (!state) {
                  setOpen(null)
                  setTimeout(() => setCurrentRow(null), 300)
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
