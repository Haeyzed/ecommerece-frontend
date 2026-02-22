'use client'

import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type State } from '../types'

type StatesDialogType = 'import' | 'add' | 'edit' | 'delete' | 'export' | 'view'

type StatesContextType = {
  open: StatesDialogType | null
  setOpen: (str: StatesDialogType | null) => void
  currentRow: State | null
  setCurrentRow: React.Dispatch<React.SetStateAction<State | null>>
}

const StatesContext = React.createContext<StatesContextType | null>(null)

export function StatesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<StatesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<State | null>(null)

  return (
    <StatesContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </StatesContext.Provider>
  )
}

export const useStates = () => {
  const statesContext = React.useContext(StatesContext)

  if (!statesContext) {
    throw new Error('useStates has to be used within <StatesContext>')
  }

  return statesContext
}