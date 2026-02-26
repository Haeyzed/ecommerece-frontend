'use client'

import { HolidaysActionDialog } from '@/features/hrm/holidays'
import { HolidaysDeleteDialog } from '@/features/hrm/holidays'
import { HolidaysExportDialog } from '@/features/hrm/holidays'
import { HolidaysImportDialog } from '@/features/hrm/holidays'
import { HolidaysViewDialog } from './holidays-view-dialog'
import { useHolidays } from './holidays-provider'
import { useAuthSession } from '@/features/auth/api'

export function HolidaysDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useHolidays()
  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []

  const canCreate = userPermissions.includes('create holidays')
  const canImport = userPermissions.includes('import holidays')
  const canExport = userPermissions.includes('export holidays')
  const canUpdate = userPermissions.includes('update holidays')
  const canDelete = userPermissions.includes('delete holidays')
  const canView = userPermissions.includes('view holidays')

  return (
    <>
      {canCreate && (
        <HolidaysActionDialog
          key='holiday-add'
          open={open === 'add'}
          onOpenChange={(isOpen) => {
            if (!isOpen) setOpen(null)
          }}
        />
      )}

      {canImport && (
        <HolidaysImportDialog
          key='holiday-import'
          open={open === 'import'}
          onOpenChange={(isOpen) => {
            if (!isOpen) setOpen(null)
          }}
        />
      )}

      {canExport && (
        <HolidaysExportDialog
          key='holiday-export'
          open={open === 'export'}
          onOpenChange={(state) => setOpen(state ? 'export' : null)}
          ids={[]}
        />
      )}

      {currentRow && (
        <>
          {canUpdate && (
            <HolidaysActionDialog
              key={`holiday-edit-${currentRow.id}`}
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
            <HolidaysViewDialog
              key={`holiday-view-${currentRow.id}`}
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
            <HolidaysDeleteDialog
              key={`holiday-delete-${currentRow.id}`}
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