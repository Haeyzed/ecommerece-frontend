'use client'

import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import type { Customer } from '../types'

type CustomersDialogType =
  | 'import'
  | 'delete'
  | 'export'
  | 'view'
  | 'multi-delete'
  | 'add-deposit'
  | 'view-deposit'

type CustomersContextType = {
  open: CustomersDialogType | null
  setOpen: (value: CustomersDialogType | null) => void
  currentRow: Customer | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Customer | null>>
}

const CustomersContext = React.createContext<CustomersContextType | null>(null)

export function CustomersProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<CustomersDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Customer | null>(null)

  return (
    <CustomersContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </CustomersContext.Provider>
  )
}

export function useCustomersContext() {
  const ctx = React.useContext(CustomersContext)
  if (!ctx) {
    throw new Error('useCustomersContext must be used within CustomersProvider')
  }
  return ctx
}

