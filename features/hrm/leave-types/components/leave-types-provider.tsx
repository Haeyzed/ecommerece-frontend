'use client'

import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type LeaveType } from '@/features/hrm/leave-types/types'

type LeaveTypesDialogType = 'import' | 'add' | 'edit' | 'delete' | 'export' | 'view'

type LeaveTypesContextType = {
  open: LeaveTypesDialogType | null
  setOpen: (str: LeaveTypesDialogType | null) => void
  currentRow: LeaveType | null
  setCurrentRow: React.Dispatch<React.SetStateAction<LeaveType | null>>
}

const LeaveTypesContext = React.createContext<LeaveTypesContextType | null>(null)

export function LeaveTypesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<LeaveTypesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<LeaveType | null>(null)

  return (
    <LeaveTypesContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </LeaveTypesContext.Provider>
  )
}

export const useLeaveTypes = () => {
  const context = React.useContext(LeaveTypesContext)

  if (!context) {
    throw new Error('useLeaveTypes has to be used within <OvertimesProvider>')
  }

  return context
}