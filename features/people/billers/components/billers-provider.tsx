'use client'

import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Biller } from '../types'

type BillersDialogType = 'import' | 'add' | 'edit' | 'delete' | 'export' | 'view'

type BillersContextType = {
  open: BillersDialogType | null
  setOpen: (str: BillersDialogType | null) => void
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

export const useBillers = () => {
  const billersContext = React.useContext(BillersContext)

  if (!billersContext) {
    throw new Error('useBillers has to be used within <BillersContext>')
  }

  return billersContext
}