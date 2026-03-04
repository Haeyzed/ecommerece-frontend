'use client'

import { useRouter } from 'next/navigation'

import { DataTableEmptyState } from '@/components/data-table'

export function AuditLogEmptyState() {
  const router = useRouter()

  return (
    <DataTableEmptyState
      title='No audits'
      description='No audit records match your current filters. Try adjusting your search or clear filters to see all audits.'
      primaryAction={{
        label: 'Clear filters',
        onClick: () => router.push('/reports/audit-log'),
      }}
    />
  )
}
