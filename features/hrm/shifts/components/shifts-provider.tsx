'use client'

import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Shift } from '@/features/hrm/shifts'

type ShiftsDialogType = 'import' | 'add' | 'edit' | 'delete' | 'export' | 'view'

type ShiftsContextType = {
  open: ShiftsDialogType | null
  setOpen: (str: ShiftsDialogType | null) => void
  currentRow: Shift | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Shift | null>>
}

const ShiftsContext = React.createContext<ShiftsContextType | null>(null)

export function ShiftsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<ShiftsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Shift | null>(null)

  return (
    <ShiftsContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </ShiftsContext.Provider>
  )
}

export const useShifts = () => {
  const shiftsContext = React.useContext(ShiftsContext)

  if (!shiftsContext) {
    throw new Error('useShifts has to be used within <ShiftsContext>')
  }

  return shiftsContext
}