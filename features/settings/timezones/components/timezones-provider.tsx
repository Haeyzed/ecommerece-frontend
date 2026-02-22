'use client'

import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Timezone } from '../types'

type TimezonesDialogType = 'import' | 'add' | 'edit' | 'delete' | 'export' | 'view'

type TimezonesContextType = {
  open: TimezonesDialogType | null
  setOpen: (str: TimezonesDialogType | null) => void
  currentRow: Timezone | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Timezone | null>>
}

const TimezonesContext = React.createContext<TimezonesContextType | null>(null)

export function TimezonesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<TimezonesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Timezone | null>(null)

  return (
    <TimezonesContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </TimezonesContext.Provider>
  )
}

export const useTimezones = () => {
  const timezonesContext = React.useContext(TimezonesContext)

  if (!timezonesContext) {
    throw new Error('useTimezones has to be used within <TimezonesContext>')
  }

  return timezonesContext
}