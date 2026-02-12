'use client'

import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import type { Supplier } from '../schemas'

type SuppliersDialogType = 'import' | 'delete' | 'export' | 'view' | 'multi-delete'

type SuppliersContextType = {
  open: SuppliersDialogType | null
  setOpen: (value: SuppliersDialogType | null) => void
  currentRow: Supplier | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Supplier | null>>
}

const SuppliersContext = React.createContext<SuppliersContextType | null>(null)

export function SuppliersProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<SuppliersDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Supplier | null>(null)

  return (
    <SuppliersContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </SuppliersContext.Provider>
  )
}

export function useSuppliersContext() {
  const ctx = React.useContext(SuppliersContext)
  if (!ctx) {
    throw new Error('useSuppliersContext must be used within SuppliersProvider')
  }
  return ctx
}
