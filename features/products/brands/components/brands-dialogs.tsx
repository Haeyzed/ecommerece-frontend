'use client'

/**
 * BrandsDialogs
 *
 * Orchestrator component that renders the appropriate dialog (Add, Edit, Delete, Import)
 * based on the current state from the BrandsProvider and User Permissions.
 *
 * @component
 */

import { BrandsActionDialog } from './brands-action-dialog'
import { BrandsDeleteDialog } from './brands-delete-dialog'
import { BrandsImportDialog } from './brands-import-dialog'
import { BrandsViewDialog } from './brands-view-dialog'
import { useBrands } from './brands-provider'
import { useAuthSession } from '@/features/auth/api'

export function BrandsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useBrands()
  const { data: session } = useAuthSession()
  
  const userPermissions = session?.user?.user_permissions || []

  const canCreate = userPermissions.includes('brands-create')
  const canImport = userPermissions.includes('brands-import')
  const canUpdate = userPermissions.includes('brands-update')
  const canDelete = userPermissions.includes('brands-delete')
  const canView = userPermissions.includes('brands-index')

  return (
    <>
      {canCreate && (
        <BrandsActionDialog
          key='brand-add'
          open={open === 'add'}
          onOpenChange={() => setOpen('add')}
        />
      )}

      {canImport && (
        <BrandsImportDialog
          key='brand-import'
          open={open === 'import'}
          onOpenChange={() => setOpen('import')}
        />
      )}

      {currentRow && (
        <>
          {canUpdate && (
            <BrandsActionDialog
              key={`brand-edit-${currentRow.id}`}
              open={open === 'edit'}
              onOpenChange={() => {
                setOpen('edit')
                setTimeout(() => {
                  setCurrentRow(null)
                }, 500)
              }}
              currentRow={currentRow}
            />
          )}
          
          {canView && (
            <BrandsViewDialog
              key={`brand-view-${currentRow.id}`}
              open={open === 'view'}
              onOpenChange={() => {
                setOpen('view')
                setTimeout(() => {
                  setCurrentRow(null)
                }, 500)
              }}
              currentRow={currentRow}
            />
          )}

          {canDelete && (
            <BrandsDeleteDialog
              key={`brand-delete-${currentRow.id}`}
              open={open === 'delete'}
              onOpenChange={() => {
                setOpen('delete')
                setTimeout(() => {
                  setCurrentRow(null)
                }, 500)
              }}
              currentRow={currentRow}
            />
          )}
        </>
      )}
    </>
  )
}