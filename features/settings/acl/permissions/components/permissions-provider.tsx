'use client'

import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Permission } from '@/features/settings/acl/permissions/types'

type PermissionsDialogType = 'import' | 'add' | 'edit' | 'delete' | 'export' | 'view'

type PermissionsContextType = {
  open: PermissionsDialogType | null
  setOpen: (str: PermissionsDialogType | null) => void
  currentRow: Permission | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Permission | null>>
}

const PermissionsContext = React.createContext<PermissionsContextType | null>(null)

export function PermissionsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<PermissionsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Permission | null>(null)

  return (
    <PermissionsContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </PermissionsContext.Provider>
  )
}

export const usePermissions = () => {
  const context = React.useContext(PermissionsContext)

  if (!context) {
    throw new Error('usePermissions has to be used within <PermissionsProvider>')
  }

  return context
}