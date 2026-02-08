'use client'

/**
 * BrandsProvider
 *
 * Context provider for managing the state of brand-related dialogs and the
 * currently selected brand for editing or deletion.
 *
 * @component
 * @param {Object} props - The component props
 * @param {React.ReactNode} props.children - Child components
 */

import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Brand } from '../types'

type BrandsDialogType = 'import' | 'add' | 'edit' | 'delete' | 'export' | 'view'

type BrandsContextType = {
  open: BrandsDialogType | null
  setOpen: (str: BrandsDialogType | null) => void
  currentRow: Brand | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Brand | null>>
}

const BrandsContext = React.createContext<BrandsContextType | null>(null)

export function BrandsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<BrandsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Brand | null>(null)

  return (
    <BrandsContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </BrandsContext.Provider>
  )
}

export const useBrands = () => {
  const brandsContext = React.useContext(BrandsContext)

  if (!brandsContext) {
    throw new Error('useBrands has to be used within <BrandsContext>')
  }

  return brandsContext
}