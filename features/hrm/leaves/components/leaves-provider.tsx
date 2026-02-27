'use client'

import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Leave } from '@/features/hrm/leaves/types'

type LeavesDialogType = 'import' | 'add' | 'edit' | 'delete' | 'export' | 'view'

type LeavesContextType = {
  open: LeavesDialogType | null
  setOpen: (str: LeavesDialogType | null) => void
  currentRow: Leave | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Leave | null>>
}

const LeavesContext = React.createContext<LeavesContextType | null>(null)

export function LeavesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<LeavesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Leave | null>(null)

  return (
    <LeavesContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </LeavesContext.Provider>
  )
}

export const useLeaves = () => {
  const context = React.useContext(LeavesContext)

  if (!context) {
    throw new Error('useLeaves has to be used within <OvertimesProvider>')
  }

  return context
}