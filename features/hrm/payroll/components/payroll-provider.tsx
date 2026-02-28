'use client'

import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type PayrollRun } from '@/features/hrm/payroll/types'

type PayrollDialogType = 'import' | 'add' | 'edit' | 'delete' | 'export' | 'view'

type PayrollContextType = {
  open: PayrollDialogType | null
  setOpen: (str: PayrollDialogType | null) => void
  currentRow: PayrollRun | null
  setCurrentRow: React.Dispatch<React.SetStateAction<PayrollRun | null>>
}

const PayrollContext = React.createContext<PayrollContextType | null>(null)

export function PayrollProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<PayrollDialogType>(null)
  const [currentRow, setCurrentRow] = useState<PayrollRun | null>(null)

  return (
    <PayrollContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </PayrollContext.Provider>
  )
}

export const usePayroll = () => {
  const context = React.useContext(PayrollContext)

  if (!context) {
    throw new Error('usePayroll has to be used within PayrollProvider')
  }

  return context
}
