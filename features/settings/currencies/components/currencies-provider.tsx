'use client'

import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import type { Currency } from '../types'

type CurrenciesDialogType = 'view'

type CurrenciesContextType = {
  open: CurrenciesDialogType | null
  setOpen: (str: CurrenciesDialogType | null) => void
  currentRow: Currency | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Currency | null>>
}

const CurrenciesContext = React.createContext<CurrenciesContextType | null>(null)

export function CurrenciesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<CurrenciesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Currency | null>(null)

  return (
    <CurrenciesContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </CurrenciesContext.Provider>
  )
}

export const useCurrencies = () => {
  const ctx = React.useContext(CurrenciesContext)
  if (!ctx) {
    throw new Error('useCurrencies has to be used within <CurrenciesProvider>')
  }
  return ctx
}
