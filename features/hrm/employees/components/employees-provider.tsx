'use client'

import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Employee } from '@/features/hrm/employees/types'

type EmployeesDialogType = 'import' | 'add' | 'edit' | 'delete' | 'export' | 'view'

type EmployeesContextType = {
  open: EmployeesDialogType | null
  setOpen: (str: EmployeesDialogType | null) => void
  currentRow: Employee | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Employee | null>>
}

const EmployeesContext = React.createContext<EmployeesContextType | null>(null)

export function EmployeesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<EmployeesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Employee | null>(null)

  return (
    <EmployeesContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </EmployeesContext.Provider>
  )
}

export const useEmployees = () => {
  const context = React.useContext(EmployeesContext)

  if (!context) {
    throw new Error('useEmployees has to be used within <EmployeesProvider>')
  }

  return context
}