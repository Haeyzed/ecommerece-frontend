'use client'

import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Holiday } from '../types'

type HolidaysDialogType = 'import' | 'add' | 'edit' | 'delete' | 'export' | 'view'

type HolidaysContextType = {
  open: HolidaysDialogType | null
  setOpen: (str: HolidaysDialogType | null) => void
  currentRow: Holiday | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Holiday | null>>
}

const HolidaysContext = React.createContext<HolidaysContextType | null>(null)

export function HolidaysProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<HolidaysDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Holiday | null>(null)

  return (
    <HolidaysContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </HolidaysContext.Provider>
  )
}

export const useHolidays = () => {
  const holidaysContext = React.useContext(HolidaysContext)

  if (!holidaysContext) {
    throw new Error('useHolidays has to be used within <HolidaysContext>')
  }

  return holidaysContext
}