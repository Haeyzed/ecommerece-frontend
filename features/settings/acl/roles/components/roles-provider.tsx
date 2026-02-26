'use client'

import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Role } from '@/features/settings/acl/roles/types'

type RolesDialogType = 'import' | 'add' | 'edit' | 'delete' | 'export' | 'view'

type RolesContextType = {
  open: RolesDialogType | null
  setOpen: (str: RolesDialogType | null) => void
  currentRow: Role | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Role | null>>
}

const RolesContext = React.createContext<RolesContextType | null>(null)

export function RolesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<RolesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Role | null>(null)

  return (
    <RolesContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </RolesContext.Provider>
  )
}

export const useRoles = () => {
  const context = React.useContext(RolesContext)

  if (!context) {
    throw new Error('useRoles has to be used within <RolesProvider>')
  }

  return context
}