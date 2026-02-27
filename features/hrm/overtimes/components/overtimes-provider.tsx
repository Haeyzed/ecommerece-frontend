'use client'

import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Overtime } from '@/features/hrm/overtimes/types'

type OvertimesDialogType = 'import' | 'add' | 'edit' | 'delete' | 'export' | 'view'

type OvertimesContextType = {
  open: OvertimesDialogType | null
  setOpen: (str: OvertimesDialogType | null) => void
  currentRow: Overtime | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Overtime | null>>
}

const OvertimesContext = React.createContext<OvertimesContextType | null>(null)

export function OvertimesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<OvertimesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Overtime | null>(null)

  return (
    <OvertimesContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </OvertimesContext.Provider>
  )
}

export const useOvertimes = () => {
  const context = React.useContext(OvertimesContext)

  if (!context) {
    throw new Error('useOvertimes has to be used within <OvertimesProvider>')
  }

  return context
}