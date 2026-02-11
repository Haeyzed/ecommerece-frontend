'use client'

import React, { useState } from 'react'

type CustomerDueReportContextType = {
  open: 'export' | null
  setOpen: (value: 'export' | null) => void
}

const CustomerDueReportContext = React.createContext<CustomerDueReportContextType | null>(null)

export function CustomerDueReportProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState<'export' | null>(null)
  return (
    <CustomerDueReportContext.Provider value={{ open, setOpen }}>
      {children}
    </CustomerDueReportContext.Provider>
  )
}

export function useCustomerDueReportDialog() {
  const ctx = React.useContext(CustomerDueReportContext)
  if (!ctx) throw new Error('useCustomerDueReportDialog must be used within CustomerDueReportProvider')
  return ctx
}
