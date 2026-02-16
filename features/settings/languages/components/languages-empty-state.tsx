'use client'

import { DataTableEmptyState } from '@/components/data-table'

export function CitiesEmptyState() {
  return (
    <DataTableEmptyState
      title="No languages found"
      description="No language data is available or your search did not match any results."
    />
  )
}
