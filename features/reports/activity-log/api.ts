'use client'

/**
 * Activity Log API Hooks
 *
 * Client-side hooks for fetching activity logs using TanStack Query.
 * Read-only: no create, update, or delete operations.
 *
 * @module features/reports/activity-log/api
 */

import { useApiClient } from '@/lib/api/api-client-client'
import { useQuery } from '@tanstack/react-query'
import type { ActivityLog } from './types'

export const activityLogKeys = {
  all: ['activity-logs'] as const,
  lists: () => [...activityLogKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...activityLogKeys.lists(), filters] as const,
}

export function useActivityLogs(params?: {
  page?: number
  per_page?: number
  search?: string
}) {
  const { api, sessionStatus } = useApiClient()
  const query = useQuery({
    queryKey: activityLogKeys.list(params),
    queryFn: async () => {
      const response = await api.get<ActivityLog[]>('/activity-logs', {
        params,
      })
      return response
    },
    enabled: sessionStatus !== 'loading',
  })
  return {
    ...query,
    isSessionLoading: sessionStatus === 'loading',
  }
}
