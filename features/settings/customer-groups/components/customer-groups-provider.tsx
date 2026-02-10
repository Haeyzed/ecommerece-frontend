'use client'

import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import type { CustomerGroup } from '../types'

type CustomerGroupsDialogType = 'import' | 'add' | 'edit' | 'delete' | 'view' | 'multi-delete'

type CustomerGroupsContextType = {
  open: CustomerGroupsDialogType | null
  setOpen: (str: CustomerGroupsDialogType | null) => void
  currentRow: CustomerGroup | null
  setCurrentRow: React.Dispatch<React.SetStateAction<CustomerGroup | null>>
}

const CustomerGroupsContext = React.createContext<CustomerGroupsContextType | null>(null)

export function CustomerGroupsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<CustomerGroupsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<CustomerGroup | null>(null)

  return (
    <CustomerGroupsContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </CustomerGroupsContext.Provider>
  )
}

export const useCustomerGroups = () => {
  const ctx = React.useContext(CustomerGroupsContext)
  if (!ctx) {
    throw new Error('useCustomerGroups has to be used within <CustomerGroupsProvider>')
  }
  return ctx
}
