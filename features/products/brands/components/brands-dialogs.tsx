'use client'

/**
 * BrandsDialogs
 *
 * Orchestrator component that renders the appropriate dialog (Add, Edit, Delete, Import)
 * based on the current state from the BrandsProvider.
 *
 * @component
 */

import { BrandsActionDialog } from './brands-action-dialog'
import { BrandsDeleteDialog } from './brands-delete-dialog'
import { BrandsImportDialog } from './brands-import-dialog'
import { BrandsViewDialog } from './brands-view-dialog'
import { useBrands } from './brands-provider'

export function BrandsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useBrands()
  return (
    <>
      <BrandsActionDialog
        key='brand-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      <BrandsImportDialog
        key='brand-import'
        open={open === 'import'}
        onOpenChange={() => setOpen('import')}
      />

      {currentRow && (
        <>
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
        </>
      )}
    </>
  )
}