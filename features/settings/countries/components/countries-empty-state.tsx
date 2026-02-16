'use client'

import { DataTableEmptyState } from '@/components/data-table'

export function CountriesEmptyState() {
  return (
    <DataTableEmptyState
      title='No countries found'
      description='No country data is available or your search did not match any results.'
    />
  )
}
