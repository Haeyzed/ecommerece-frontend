'use client'

/**
 * AuditLogProvider
 *
 * Context provider for managing the state of audit log dialogs and the
 * currently selected audit for viewing.
 */

import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import type { Audit } from '../types'

type AuditLogDialogType = 'view'

type AuditLogContextType = {
  open: AuditLogDialogType | null
  setOpen: (str: AuditLogDialogType | null) => void
  currentRow: Audit | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Audit | null>>
}

const AuditLogContext = React.createContext<AuditLogContextType | null>(null)

export function AuditLogProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<AuditLogDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Audit | null>(null)

  return (
    <AuditLogContext.Provider
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </AuditLogContext.Provider>
  )
}

export function useAuditLog() {
  const context = React.useContext(AuditLogContext)

  if (!context) {
    throw new Error('useAuditLog must be used within AuditLogProvider')
  }

  return context
}
