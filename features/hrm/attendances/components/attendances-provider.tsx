'use client'

import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Attendance } from '@/features/hrm/attendances/types'

type AttendancesDialogType = 'import' | 'add' | 'edit' | 'delete' | 'export' | 'view'

type AttendancesContextType = {
  open: AttendancesDialogType | null
  setOpen: (str: AttendancesDialogType | null) => void
  currentRow: Attendance | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Attendance | null>>
}

const AttendancesContext = React.createContext<AttendancesContextType | null>(null)

export function AttendancesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<AttendancesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Attendance | null>(null)

  return (
    <AttendancesContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </AttendancesContext.Provider>
  )
}

export const useAttendances = () => {
  const context = React.useContext(AttendancesContext)

  if (!context) {
    throw new Error('useAttendances has to be used within <AttendancesProvider>')
  }

  return context
}