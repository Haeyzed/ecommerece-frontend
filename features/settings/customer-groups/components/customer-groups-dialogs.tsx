'use client'

import { useCustomerGroupsContext } from './customer-groups-provider'
import { useAuthSession } from '@/features/auth/api'
import { CustomerGroupsActionDialog } from './customer-groups-action-dialog'
import { CustomerGroupsDeleteDialog } from './customer-groups-delete-dialog'
import { CustomerGroupsViewDialog } from './customer-groups-view-dialog'
import { CustomerGroupsImportDialog } from './customer-groups-import-dialog'

export function CustomerGroupsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCustomerGroupsContext()
  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []
  const canCreate = userPermissions.includes('customer-groups-create')
  const canUpdate = userPermissions.includes('customer-groups-update')
  const canDelete = userPermissions.includes('customer-groups-delete')
  const canView = userPermissions.includes('customer-groups-index')
  const canImport = userPermissions.includes('customer-groups-import')

  return (
    <>
      {canCreate && (
        <CustomerGroupsActionDialog
          open={open === 'add'}
          onOpenChange={(state) => setOpen(state ? 'add' : null)}
        />
      )}
      {canImport && (
        <CustomerGroupsImportDialog
          open={open === 'import'}
          onOpenChange={(state) => setOpen(state ? 'import' : null)}
        />
      )}
      {currentRow && (
        <>
          {canUpdate && (
            <CustomerGroupsActionDialog
              open={open === 'edit'}
              onOpenChange={(state) => {
                setOpen(state ? 'edit' : null)
                if (!state) setTimeout(() => setCurrentRow(null), 300)
              }}
              currentRow={currentRow}
            />
          )}
          {canView && (
            <CustomerGroupsViewDialog
              currentRow={currentRow}
              open={open === 'view'}
              onOpenChange={(state) => {
                setOpen(state ? 'view' : null)
                if (!state) setTimeout(() => setCurrentRow(null), 300)
              }}
            />
          )}
          {canDelete && (
            <CustomerGroupsDeleteDialog
              open={open === 'delete'}
              onOpenChange={(state) => {
                if (!state) {
                  setOpen(null)
                  setTimeout(() => setCurrentRow(null), 300)
                } else setOpen('delete')
              }}
              currentRow={currentRow}
            />
          )}
        </>
      )}
    </>
  )
}
