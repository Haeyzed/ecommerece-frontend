'use client'

import { RolesActionDialog } from '@/features/settings/acl/roles'
import { RolesDeleteDialog } from '@/features/settings/acl/roles'
import { RolesExportDialog } from '@/features/settings/acl/roles'
import { RolesImportDialog } from '@/features/settings/acl/roles'
import { RolesViewDialog } from './roles-view-dialog'
import { useRoles } from './roles-provider'
import { useAuthSession } from '@/features/auth/api'

export function RolesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRoles()
  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []

  const canCreate = userPermissions.includes('create roles')
  const canImport = userPermissions.includes('import roles')
  const canExport = userPermissions.includes('export roles')
  const canUpdate = userPermissions.includes('update roles')
  const canDelete = userPermissions.includes('delete roles')
  const canView = userPermissions.includes('view roles')

  return (
    <>
      {canCreate && (
        <RolesActionDialog
          key='role-add'
          open={open === 'add'}
          onOpenChange={(isOpen) => {
            if (!isOpen) setOpen(null)
          }}
        />
      )}

      {canImport && (
        <RolesImportDialog
          key='role-import'
          open={open === 'import'}
          onOpenChange={(isOpen) => {
            if (!isOpen) setOpen(null)
          }}
        />
      )}

      {canExport && (
        <RolesExportDialog
          key='role-export'
          open={open === 'export'}
          onOpenChange={(state) => setOpen(state ? 'export' : null)}
          ids={[]}
        />
      )}

      {currentRow && (
        <>
          {canUpdate && (
            <RolesActionDialog
              key={`role-edit-${currentRow.id}`}
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
            <RolesViewDialog
              key={`role-view-${currentRow.id}`}
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
            <RolesDeleteDialog
              key={`role-delete-${currentRow.id}`}
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