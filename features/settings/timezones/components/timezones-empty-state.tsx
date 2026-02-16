'use client'

import { DataTableEmptyState } from '@/components/data-table'

export function TimezonesEmptyState() {
  return (
    <DataTableEmptyState
      title='No timezones found'
      description='No timezone data is available or your search did not match any results.'
    />
  )
}
