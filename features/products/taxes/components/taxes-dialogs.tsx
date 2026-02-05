'use client'

/**
 * TaxesDialogs
 *
 * Orchestrator component that renders the appropriate dialog (Add, Edit, Delete, Import)
 * based on the current state from the TaxesProvider.
 *
 * @component
 */

import { TaxesActionDialog } from './taxes-action-dialog'
import { TaxesDeleteDialog } from './taxes-delete-dialog'
import { TaxesImportDialog } from './taxes-import-dialog'
import { TaxesViewDialog } from './taxes-view-dialog'
import { useTaxes } from './taxes-provider'

export function TaxesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useTaxes()
  return (
    <>
      <TaxesActionDialog
        key='tax-add'
        open={open === 'add'}
        onOpenChange={(isOpen) => {
          if (!isOpen) setOpen(null)
        }}
      />

      <TaxesImportDialog
        key='tax-import'
        open={open === 'import'}
        onOpenChange={(isOpen) => {
          if (!isOpen) setOpen(null)
        }}
      />

      {currentRow && (
        <>
          <TaxesActionDialog
            key={`tax-edit-${currentRow.id}`}
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
          
          <TaxesViewDialog
            key={`tax-view-${currentRow.id}`}
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

          <TaxesDeleteDialog
            key={`tax-delete-${currentRow.id}`}
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
        </>
      )}
    </>
  )
}