'use client'

import { DataTableEmptyState } from '@/components/data-table'

export function StatesEmptyState() {
  return (
    <DataTableEmptyState
      title='No states found'
      description='No state data is available or your search did not match any results.'
    />
  )
}
