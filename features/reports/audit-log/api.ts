'use client'

/**
 * Audit Log API Hooks
 *
 * Client-side hooks for fetching audits from Laravel Auditing.
 * Returns full Audit structure per standard.
 *
 * @module features/reports/audit-log/api
 */

import { useApiClient } from '@/lib/api/api-client-client'
import { useQuery } from '@tanstack/react-query'
import type { Audit } from './types'

export const auditKeys = {
  all: ['audits'] as const,
  lists: () => [...auditKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...auditKeys.lists(), filters] as const,
}

export interface UseAuditsParams {
  page?: number
  per_page?: number
  search?: string
  event?: 'created' | 'updated' | 'deleted' | 'restored'
  auditable_type?: string
  ip_address?: string
  user?: string
}

export function useAudits(params?: UseAuditsParams) {
  const { api, sessionStatus } = useApiClient()
  const queryParams = (params ?? {}) as Record<
    string,
    string | number | boolean | null | undefined
  >
  const query = useQuery({
    queryKey: auditKeys.list(queryParams as Record<string, unknown>),
    queryFn: async () => {
      const response = await api.get<Audit[]>('/audit-logs', {
        params: queryParams,
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
