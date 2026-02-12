'use client'

import { useBillersContext } from './billers-provider'
import { useAuthSession } from '@/features/auth/api'
import { BillersDeleteDialog } from './billers-delete-dialog'
import { BillersExportDialog } from './billers-export-dialog'
import { BillersImportDialog } from './billers-import-dialog'

export function BillersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useBillersContext()
  const { data: session } = useAuthSession()

  const userPermissions = session?.user?.user_permissions || []
  const canImport = userPermissions.includes('billers-import')
  const canExport = userPermissions.includes('billers-export')
  const canDelete = userPermissions.includes('billers-delete')

  return (
    <>
      {canImport && (
        <BillersImportDialog
          open={open === 'import'}
          onOpenChange={(state) => setOpen(state ? 'import' : null)}
        />
      )}

      {canExport && (
        <BillersExportDialog
          open={open === 'export'}
          onOpenChange={(state) => setOpen(state ? 'export' : null)}
          ids={[]}
        />
      )}

      {currentRow && canDelete && (
        <BillersDeleteDialog
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
