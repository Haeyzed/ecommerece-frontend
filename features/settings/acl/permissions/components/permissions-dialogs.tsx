'use client'

import { PermissionsActionDialog } from '@/features/settings/acl/permissions'
import { PermissionsDeleteDialog } from '@/features/settings/acl/permissions'
import { PermissionsExportDialog } from '@/features/settings/acl/permissions'
import { PermissionsImportDialog } from '@/features/settings/acl/permissions'
import { PermissionsViewDialog } from './permissions-view-dialog'
import { usePermissions } from './permissions-provider'
import { useAuthSession } from '@/features/auth/api'

export function PermissionsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = usePermissions()
  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []

  const canCreate = userPermissions.includes('create permissions')
  const canImport = userPermissions.includes('import permissions')
  const canExport = userPermissions.includes('export permissions')
  const canUpdate = userPermissions.includes('update permissions')
  const canDelete = userPermissions.includes('delete permissions')
  const canView = userPermissions.includes('view permissions')

  return (
    <>
      {canCreate && (
        <PermissionsActionDialog
          key='permission-add'
          open={open === 'add'}
          onOpenChange={(isOpen) => {
            if (!isOpen) setOpen(null)
          }}
        />
      )}

      {canImport && (
        <PermissionsImportDialog
          key='permission-import'
          open={open === 'import'}
          onOpenChange={(isOpen) => {
            if (!isOpen) setOpen(null)
          }}
        />
      )}

      {canExport && (
        <PermissionsExportDialog
          key='permission-export'
          open={open === 'export'}
          onOpenChange={(state) => setOpen(state ? 'export' : null)}
          ids={[]}
        />
      )}

      {currentRow && (
        <>
          {canUpdate && (
            <PermissionsActionDialog
              key={`permission-edit-${currentRow.id}`}
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
            <PermissionsViewDialog
              key={`permission-view-${currentRow.id}`}
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
            <PermissionsDeleteDialog
              key={`permission-delete-${currentRow.id}`}
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