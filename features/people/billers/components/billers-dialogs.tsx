'use client'

import { BillersActionDialog } from './billers-action-dialog'
import { BillersDeleteDialog } from './billers-delete-dialog'
import { BillersExportDialog } from './billers-export-dialog'
import { BillersImportDialog } from './billers-import-dialog'
import { BillersViewDialog } from './billers-view-dialog'
import { useBillers } from './billers-provider'
import { useAuthSession } from '@/features/auth/api'

export function BillersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useBillers()
  const { data: session } = useAuthSession()

  const userPermissions = session?.user?.user_permissions || []

  const canCreate = userPermissions.includes('create billers')
  const canImport = userPermissions.includes('import billers')
  const canExport = userPermissions.includes('export billers')
  const canUpdate = userPermissions.includes('update billers')
  const canDelete = userPermissions.includes('delete billers')
  const canView = userPermissions.includes('view billers')

  return (
    <>
      {canCreate && (
        <BillersActionDialog
          key='biller-add'
          open={open === 'add'}
          onOpenChange={() => setOpen('add')}
        />
      )}

      {canImport && (
        <BillersImportDialog
          key='biller-import'
          open={open === 'import'}
          onOpenChange={() => setOpen('import')}
        />
      )}

      {canExport && (
        <BillersExportDialog
          key='biller-export'
          open={open === 'export'}
          onOpenChange={(state) => setOpen(state ? 'export' : null)}
          ids={[]}
        />
      )}

      {currentRow && (
        <>
          {canUpdate && (
            <BillersActionDialog
              key={`biller-edit-${currentRow.id}`}
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
            <BillersViewDialog
              key={`biller-view-${currentRow.id}`}
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
            <BillersDeleteDialog
              key={`biller-delete-${currentRow.id}`}
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