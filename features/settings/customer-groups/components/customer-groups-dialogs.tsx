'use client'

import { useCustomerGroups } from './customer-groups-provider'
import { useAuthSession } from '@/features/auth/api'
import { CustomerGroupsActionDialog } from './customer-groups-action-dialog'
import { CustomerGroupsDeleteDialog } from './customer-groups-delete-dialog'
import { CustomerGroupsViewDialog } from './customer-groups-view-dialog'
import { CustomerGroupsImportDialog } from './customer-groups-import-dialog'

export function CustomerGroupsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCustomerGroups()
  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions ?? []
  const canCreate = userPermissions.includes('customer-groups-create')
  const canUpdate = userPermissions.includes('customer-groups-update')
  const canDelete = userPermissions.includes('customer-groups-delete')
  const canView = userPermissions.includes('customer-groups-index')
  const canImport = userPermissions.includes('customer-groups-import')

  return (
    <>
      {canCreate && (
        <CustomerGroupsActionDialog
          key='customer-group-add'
          open={open === 'add'}
          onOpenChange={() => setOpen('add')}
        />
      )}

      {canImport && (
        <CustomerGroupsImportDialog
          key='customer-group-import'
          open={open === 'import'}
          onOpenChange={() => setOpen('import')}
        />
      )}

      {currentRow && (
        <>
          {canUpdate && (
            <CustomerGroupsActionDialog
              key={`customer-group-edit-${currentRow.id}`}
              open={open === 'edit'}
              onOpenChange={() => {
                setOpen('edit')
                setTimeout(() => setCurrentRow(null), 500)
              }}
              currentRow={currentRow}
            />
          )}

          {canView && (
            <CustomerGroupsViewDialog
              key={`customer-group-view-${currentRow.id}`}
              open={open === 'view'}
              onOpenChange={() => {
                setOpen('view')
                setTimeout(() => setCurrentRow(null), 500)
              }}
              currentRow={currentRow}
            />
          )}

          {canDelete && (
            <CustomerGroupsDeleteDialog
              key={`customer-group-delete-${currentRow.id}`}
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
