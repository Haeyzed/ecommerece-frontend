'use client'

import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import type { City } from '../types'

type CitiesDialogType = 'view'

type CitiesContextType = {
  open: CitiesDialogType | null
  setOpen: (str: CitiesDialogType | null) => void
  currentRow: City | null
  setCurrentRow: React.Dispatch<React.SetStateAction<City | null>>
}

const CitiesContext = React.createContext<CitiesContextType | null>(null)

export function CitiesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<CitiesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<City | null>(null)

  return (
    <CitiesContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </CitiesContext.Provider>
  )
}

export const useCities = () => {
  const ctx = React.useContext(CitiesContext)
  if (!ctx) {
    throw new Error('useCities has to be used within <CitiesProvider>')
  }
  return ctx
}
