'use client'

import { useCustomersContext } from './customers-provider'
import { useAuthSession } from '@/features/auth/api'
import { CustomersAddDepositDialog } from './customers-add-deposit-dialog'
import { CustomersDeleteDialog } from './customers-delete-dialog'
import { CustomersExportDialog } from './customers-export-dialog'
import { CustomersImportDialog } from './customers-import-dialog'
import { CustomersViewDepositDialog } from './customers-view-deposit-dialog'

export function CustomersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCustomersContext()
  const { data: session } = useAuthSession()

  const userPermissions = session?.user?.user_permissions || []
  const canImport = userPermissions.includes('customers-import')
  const canExport = userPermissions.includes('customers-export')
  const canDelete = userPermissions.includes('customers-delete')

  return (
    <>
      {canImport && (
        <CustomersImportDialog
          open={open === 'import'}
          onOpenChange={(state) => setOpen(state ? 'import' : null)}
        />
      )}

      {canExport && (
        <CustomersExportDialog
          open={open === 'export'}
          onOpenChange={(state) => setOpen(state ? 'export' : null)}
          ids={[]}
        />
      )}

      {currentRow && canDelete && (
        <CustomersDeleteDialog
          open={open === 'delete'}
          onOpenChange={(state) => {
            if (!state) {
              setOpen(null)
              setTimeout(() => setCurrentRow(null), 300)
            }
          }}
          currentRow={currentRow}
        />
      )}

      {currentRow && open === 'add-deposit' && (
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

      {currentRow && open === 'view-deposit' && (
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
  )
}
