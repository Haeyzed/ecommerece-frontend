'use client'

/**
 * ActivityLogProvider
 *
 * Context provider for managing the state of audit log dialogs and the
 * currently selected audit for viewing.
 */

import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import type { Audit } from '../types'

type ActivityLogDialogType = 'view'

type ActivityLogContextType = {
  open: ActivityLogDialogType | null
  setOpen: (str: ActivityLogDialogType | null) => void
  currentRow: Audit | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Audit | null>>
}

const ActivityLogContext = React.createContext<ActivityLogContextType | null>(
  null
)

export function ActivityLogProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<ActivityLogDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Audit | null>(null)

  return (
    <ActivityLogContext.Provider
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </ActivityLogContext.Provider>
  )
}

export function useActivityLog() {
  const context = React.useContext(ActivityLogContext)

  if (!context) {
    throw new Error('useActivityLog must be used within ActivityLogProvider')
  }

  return context
}
