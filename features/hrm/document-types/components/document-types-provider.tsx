'use client'

import React, { useState } from 'react'

import useDialogState from '@/hooks/use-dialog-state'

import { type DocumentType } from '@/features/hrm/document-types/types'

type DocumentTypesDialogType =
  | 'import'
  | 'add'
  | 'edit'
  | 'delete'
  | 'export'
  | 'view'

type DocumentTypesContextType = {
  open: DocumentTypesDialogType | null
  setOpen: (str: DocumentTypesDialogType | null) => void
  currentRow: DocumentType | null
  setCurrentRow: React.Dispatch<React.SetStateAction<DocumentType | null>>
}

const DocumentTypesContext =
  React.createContext<DocumentTypesContextType | null>(null)

export function DocumentTypesProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<DocumentTypesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<DocumentType | null>(null)

  return (
    <DocumentTypesContext.Provider
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </DocumentTypesContext.Provider>
  )
}

export const useDocumentTypes = () => {
  const context = React.useContext(DocumentTypesContext)

  if (!context) {
    throw new Error(
      'useDocumentTypes has to be used within <DocumentTypesProvider>'
    )
  }

  return context
}
