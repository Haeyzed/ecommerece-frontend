'use client'

import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Designation } from '@/features/hrm/designations'

type DesignationsDialogType = 'import' | 'add' | 'edit' | 'delete' | 'export' | 'view'

type DesignationsContextType = {
  open: DesignationsDialogType | null
  setOpen: (str: DesignationsDialogType | null) => void
  currentRow: Designation | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Designation | null>>
}

const DesignationsContext = React.createContext<DesignationsContextType | null>(null)

export function EmployeesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<DesignationsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Designation | null>(null)

  return (
    <DesignationsContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </DesignationsContext.Provider>
  )
}

export const useDesignations = () => {
  const designationsContext = React.useContext(DesignationsContext)

  if (!designationsContext) {
    throw new Error('useDesignations has to be used within <DesignationsContext>')
  }

  return designationsContext
}