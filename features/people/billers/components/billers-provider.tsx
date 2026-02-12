'use client'

import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import type { Biller } from '../schemas'

type BillersDialogType = 'import' | 'delete' | 'export' | 'view' | 'multi-delete'

type BillersContextType = {
  open: BillersDialogType | null
  setOpen: (value: BillersDialogType | null) => void
  currentRow: Biller | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Biller | null>>
}

const BillersContext = React.createContext<BillersContextType | null>(null)

export function BillersProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<BillersDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Biller | null>(null)

  return (
    <BillersContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </BillersContext.Provider>
  )
}

export function useBillersContext() {
  const ctx = React.useContext(BillersContext)
  if (!ctx) {
    throw new Error('useBillersContext must be used within BillersProvider')
  }
  return ctx
}

