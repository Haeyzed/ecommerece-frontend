'use client'

import { DataTableEmptyState } from '@/components/data-table'

export function CitiesEmptyState() {
  return (
    <DataTableEmptyState
      title="No cities found"
      description="No city data is available or your search did not match any results."
    />
  )
}
