'use client'

/**
 * CategoriesDialogs
 *
 * A orchestrator component that manages the rendering of various dialogs
 * (Add, Edit, Delete, Import) based on the current state from the CategoriesProvider
 * and the User's Permissions.
 *
 * @component
 */

import { CategoriesActionDialog } from './categories-action-dialog'
import { CategoriesDeleteDialog } from './categories-delete-dialog'
import { CategoriesExportDialog } from './categories-export-dialog'
import { CategoriesImportDialog } from './categories-import-dialog'
import { CategoriesViewDialog } from './categories-view-dialog'
import { useCategories } from './categories-provider'
import { useAuthSession } from '@/features/auth/api'

export function CategoriesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCategories()
  const { data: session } = useAuthSession()
  
  // Get permissions safely
  const userPermissions = session?.user?.user_permissions || []

  // Define permission checks based on your ACL
  const canCreate = userPermissions.includes('create categories')
  const canImport = userPermissions.includes('import categories')
  const canExport = userPermissions.includes('export categories')
  const canUpdate = userPermissions.includes('update categories')
  const canDelete = userPermissions.includes('delete categories')
  const canView = userPermissions.includes('view categories')

  return (
    <>
      {canCreate && (
        <CategoriesActionDialog
          key='category-add'
          open={open === 'add'}
          onOpenChange={() => setOpen('add')}
        />
      )}

      {canImport && (
        <CategoriesImportDialog
          key='category-import'
          open={open === 'import'}
          onOpenChange={() => setOpen('import')}
        />
      )}

      {canExport && (
        <CategoriesExportDialog
          key='category-export'
          open={open === 'export'}
          onOpenChange={(state) => setOpen(state ? 'export' : null)}
          ids={[]}
        />
      )}

      {currentRow && (
        <>
          {canUpdate && (
            <CategoriesActionDialog
              key={`category-edit-${currentRow.id}`}
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
            <CategoriesViewDialog
              key={`category-view-${currentRow.id}`}
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
            <CategoriesDeleteDialog
              key={`category-delete-${currentRow.id}`}
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