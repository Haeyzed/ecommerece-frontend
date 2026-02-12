'use client'

import { useSuppliersContext } from './suppliers-provider'
import { useAuthSession } from '@/features/auth/api'
import { SuppliersDeleteDialog } from './suppliers-delete-dialog'
import { SuppliersExportDialog } from './suppliers-export-dialog'
import { SuppliersImportDialog } from './suppliers-import-dialog'
import { SuppliersViewDialog } from './suppliers-view-dialog'

export function SuppliersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useSuppliersContext()
  const { data: session } = useAuthSession()

  const userPermissions = session?.user?.user_permissions || []
  const canImport = userPermissions.includes('suppliers-import')
  const canExport = userPermissions.includes('suppliers-export')
  const canDelete = userPermissions.includes('suppliers-delete')
  const canView = userPermissions.includes('suppliers-index')

  return (
    <>
      {canView && currentRow && (
        <SuppliersViewDialog
          currentRow={currentRow}
          open={open === 'view'}
          onOpenChange={(state) => {
            if (!state) {
              setOpen(null)
              setTimeout(() => setCurrentRow(null), 500)
            }
          }}
        />
      )}

      {canImport && (
        <SuppliersImportDialog
          open={open === 'import'}
          onOpenChange={(state) => setOpen(state ? 'import' : null)}
        />
      )}

      {canExport && (
        <SuppliersExportDialog
          open={open === 'export'}
          onOpenChange={(state) => setOpen(state ? 'export' : null)}
          ids={[]}
        />
      )}

      {currentRow && canDelete && (
        <SuppliersDeleteDialog
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
    </>
  )
}
