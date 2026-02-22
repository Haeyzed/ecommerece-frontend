'use client'

import { LanguagesActionDialog } from './languages-action-dialog'
import { LanguagesDeleteDialog } from './languages-delete-dialog'
import { LanguagesExportDialog } from './languages-export-dialog'
import { LanguagesImportDialog } from './languages-import-dialog'
import { LanguagesViewDialog } from './languages-view-dialog'
import { useLanguages } from './languages-provider'
import { useAuthSession } from '@/features/auth/api'

export function LanguagesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useLanguages()
  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []
  const canCreate = userPermissions.includes('create languages')
  const canImport = userPermissions.includes('import languages')
  const canExport = userPermissions.includes('export languages')
  const canUpdate = userPermissions.includes('update languages')
  const canDelete = userPermissions.includes('delete languages')
  const canView = userPermissions.includes('view languages')

  return (
    <>
      {canCreate && (
        <LanguagesActionDialog
          key='language-add'
          open={open === 'add'}
          onOpenChange={(isOpen) => {
            if (!isOpen) setOpen(null)
          }}
        />
      )}

      {canImport && (
        <LanguagesImportDialog
          key='language-import'
          open={open === 'import'}
          onOpenChange={(isOpen) => {
            if (!isOpen) setOpen(null)
          }}
        />
      )}

      {canExport && (
        <LanguagesExportDialog
          key='language-export'
          open={open === 'export'}
          onOpenChange={(state) => setOpen(state ? 'export' : null)}
          ids={[]}
        />
      )}

      {currentRow && (
        <>
          {canUpdate && (
            <LanguagesActionDialog
              key={`language-edit-${currentRow.id}`}
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
            <LanguagesViewDialog
              key={`language-view-${currentRow.id}`}
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
            <LanguagesDeleteDialog
              key={`language-delete-${currentRow.id}`}
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