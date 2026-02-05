'use client'

/**
 * UnitsDialogs
 *
 * Orchestrator component that renders the appropriate dialog (Add, Edit, Delete, Import)
 * based on the current state from the UnitsProvider.
 *
 * @component
 */

import { UnitsActionDialog } from './units-action-dialog'
import { UnitsDeleteDialog } from './units-delete-dialog'
import { UnitsImportDialog } from './units-import-dialog'
import { UnitsViewDialog } from './units-view-dialog'
import { useUnits } from './units-provider'

export function UnitsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useUnits()
  return (
    <>
      <UnitsActionDialog
        key='unit-add'
        open={open === 'add'}
        onOpenChange={(isOpen) => {
          if (!isOpen) setOpen(null)
        }}
      />

      <UnitsImportDialog
        key='unit-import'
        open={open === 'import'}
        onOpenChange={(isOpen) => {
          if (!isOpen) setOpen(null)
        }}
      />

      {currentRow && (
        <>
          <UnitsActionDialog
            key={`unit-edit-${currentRow.id}`}
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
          
          <UnitsViewDialog
            key={`unit-view-${currentRow.id}`}
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

          <UnitsDeleteDialog
            key={`unit-delete-${currentRow.id}`}
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