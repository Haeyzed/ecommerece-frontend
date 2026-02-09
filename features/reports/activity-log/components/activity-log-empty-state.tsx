'use client'

import { DataTableEmptyState } from '@/components/data-table'
import { useRouter } from 'next/navigation'

export function ActivityLogEmptyState() {
  const router = useRouter()

  return (
    <DataTableEmptyState
      title='No activity logs'
      description='No activity logs match your current filters. Try adjusting your search or clear filters to see all logs.'
      primaryAction={{
        label: 'Clear filters',
        onClick: () => router.push('/reports/activity-log'),
      }}
    />
  )
}
