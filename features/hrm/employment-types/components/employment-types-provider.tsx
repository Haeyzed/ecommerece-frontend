'use client'

import React, { useState } from 'react'

import useDialogState from '@/hooks/use-dialog-state'

import { type EmploymentType } from '@/features/hrm/employment-types/types'

type EmploymentTypesDialogType =
  | 'import'
  | 'add'
  | 'edit'
  | 'delete'
  | 'export'
  | 'view'

type EmploymentTypesContextType = {
  open: EmploymentTypesDialogType | null
  setOpen: (str: EmploymentTypesDialogType | null) => void
  currentRow: EmploymentType | null
  setCurrentRow: React.Dispatch<React.SetStateAction<EmploymentType | null>>
}

const EmploymentTypesContext =
  React.createContext<EmploymentTypesContextType | null>(null)

export function EmploymentTypesProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<EmploymentTypesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<EmploymentType | null>(null)

  return (
    <EmploymentTypesContext.Provider
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </EmploymentTypesContext.Provider>
  )
}

export const useEmploymentTypes = () => {
  const context = React.useContext(EmploymentTypesContext)

  if (!context) {
    throw new Error(
      'useEmploymentTypes has to be used within <EmploymentTypesProvider>'
    )
  }

  return context
}
