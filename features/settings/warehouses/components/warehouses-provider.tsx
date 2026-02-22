'use client'

import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Warehouse } from '../types'

type WarehousesDialogType = 'import' | 'add' | 'edit' | 'delete' | 'export' | 'view'

type WarehousesContextType = {
  open: WarehousesDialogType | null
  setOpen: (str: WarehousesDialogType | null) => void
  currentRow: Warehouse | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Warehouse | null>>
}

const WarehousesContext = React.createContext<WarehousesContextType | null>(null)

export function WarehousesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<WarehousesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Warehouse | null>(null)

  return (
    <WarehousesContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </WarehousesContext.Provider>
  )
}

export const useWarehouses = () => {
  const warehousesContext = React.useContext(WarehousesContext)

  if (!warehousesContext) {
    throw new Error('useWarehouses has to be used within <WarehousesContext>')
  }

  return warehousesContext
}