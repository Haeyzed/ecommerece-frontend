'use client'

import { DataTableEmptyState } from '@/components/data-table'

export function CitiesEmptyState() {
  return (
    <DataTableEmptyState
      title="No currencies found"
      description="No currency data is available or your search did not match any results."
    />
  )
}
