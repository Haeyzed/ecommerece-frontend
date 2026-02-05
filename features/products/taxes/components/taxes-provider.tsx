'use client'

/**
 * TaxesProvider
 *
 * Context provider for managing the state of tax-related dialogs and the
 * currently selected tax for editing or deletion.
 *
 * @component
 * @param {Object} props - The component props
 * @param {React.ReactNode} props.children - Child components
 */

import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Tax } from '../types'

type TaxesDialogType = 'import' | 'add' | 'edit' | 'delete' | 'view'

type TaxesContextType = {
  open: TaxesDialogType | null
  setOpen: (str: TaxesDialogType | null) => void
  currentRow: Tax | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Tax | null>>
}

const TaxesContext = React.createContext<TaxesContextType | null>(null)

export function TaxesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<TaxesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Tax | null>(null)

  return (
    <TaxesContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </TaxesContext>
  )
}

export const useTaxes = () => {
  const taxesContext = React.useContext(TaxesContext)

  if (!taxesContext) {
    throw new Error('useTaxes has to be used within <TaxesContext>')
  }

  return taxesContext
}