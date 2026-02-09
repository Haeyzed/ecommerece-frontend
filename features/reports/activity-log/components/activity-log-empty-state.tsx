'use client'

import { DataTableEmptyState } from '@/components/data-table'
import { useRouter } from 'next/navigation'

export function ActivityLogEmptyState() {
  const router = useRouter()

  return (
    <DataTableEmptyState
      title='No audits'
      description='No audit records match your current filters. Try adjusting your search or clear filters to see all audits.'
      primaryAction={{
        label: 'Clear filters',
        onClick: () => router.push('/reports/activity-log'),
      }}
    />
  )
}
