'use client'

/**
 * CategoriesProvider
 *
 * Context provider for managing the state of category dialogs (open/closed)
 * and the currently selected row for editing or deletion.
 *
 * @component
 * @param {Object} props - The component props
 * @param {React.ReactNode} props.children - Child components
 */

import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Category } from '../types'

type CategoriesDialogType = 'import' | 'add' | 'edit' | 'delete' | 'export' | 'view'

type CategoriesContextType = {
  open: CategoriesDialogType | null
  setOpen: (str: CategoriesDialogType | null) => void
  currentRow: Category | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Category | null>>
}

const CategoriesContext = React.createContext<CategoriesContextType | null>(null)

export function CategoriesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<CategoriesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Category | null>(null)

  return (
    <CategoriesContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </CategoriesContext.Provider>
  )
}

export const useCategories = () => {
  const categoriesContext = React.useContext(CategoriesContext)

  if (!categoriesContext) {
    throw new Error('useCategories has to be used within <CategoriesContext>')
  }

  return categoriesContext
}