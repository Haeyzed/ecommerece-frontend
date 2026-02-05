'use client'

/**
 * UnitsProvider
 *
 * Context provider for managing the state of unit-related dialogs and the
 * currently selected unit for editing or deletion.
 *
 * @component
 * @param {Object} props - The component props
 * @param {React.ReactNode} props.children - Child components
 */

import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Unit } from '../types'

type UnitsDialogType = 'import' | 'add' | 'edit' | 'delete' | 'view'

type UnitsContextType = {
  open: UnitsDialogType | null
  setOpen: (str: UnitsDialogType | null) => void
  currentRow: Unit | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Unit | null>>
}

const UnitsContext = React.createContext<UnitsContextType | null>(null)

export function UnitsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<UnitsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Unit | null>(null)

  return (
    <UnitsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </UnitsContext>
  )
}

export const useUnits = () => {
  const unitsContext = React.useContext(UnitsContext)

  if (!unitsContext) {
    throw new Error('useUnits has to be used within <UnitsContext>')
  }

  return unitsContext
}