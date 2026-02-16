'use client'

import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import type { Language } from '../types'

type LanguagesDialogType = 'view'

type LanguagesContextType = {
  open: LanguagesDialogType | null
  setOpen: (str: LanguagesDialogType | null) => void
  currentRow: Language | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Language | null>>
}

const LanguagesContext = React.createContext<LanguagesContextType | null>(null)

export function LanguagesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<LanguagesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Language | null>(null)

  return (
    <LanguagesContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </LanguagesContext.Provider>
  )
}

export const useLanguages = () => {
  const ctx = React.useContext(LanguagesContext)
  if (!ctx) {
    throw new Error('useLanguages has to be used within <LanguagesProvider>')
  }
  return ctx
}
