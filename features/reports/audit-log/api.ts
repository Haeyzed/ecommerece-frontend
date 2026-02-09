'use client'

/**
 * Audit Log API Hooks
 *
 * Client-side hooks for fetching audits, auditable models, and export.
 *
 * @module features/reports/audit-log/api
 */

import { useApiClient } from '@/lib/api/api-client-client'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { Audit } from './types'

export const auditKeys = {
  all: ['audits'] as const,
  lists: () => [...auditKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...auditKeys.lists(), filters] as const,
  auditableModels: () => [...auditKeys.all, 'auditable-models'] as const,
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

export interface AuditableModelOption {
  value: string
  label: string
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

export function useAuditableModels() {
  const { api, sessionStatus } = useApiClient()
  return useQuery({
    queryKey: auditKeys.auditableModels(),
    queryFn: async () => {
      const response = await api.get<AuditableModelOption[]>(
        '/utility/auditable-models'
      )
      return response.data ?? []
    },
    enabled: sessionStatus !== 'loading',
  })
}

export type AuditExportParams = {
  ids?: number[]
  format: 'excel' | 'pdf'
  method: 'download' | 'email'
  columns: string[]
  user_id?: number
}

export function useAuditsExport() {
  const { api } = useApiClient()

  return useMutation({
    mutationFn: async (params: AuditExportParams) => {
      if (params.method === 'download') {
        const blob = await api.postBlob('/audit-logs/export', params)
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `audits-export-${Date.now()}.${params.format === 'pdf' ? 'pdf' : 'xlsx'}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        return { message: 'Export downloaded successfully' }
      }
      const response = await api.post('/audit-logs/export', params)
      if (!response.success) throw new Error(response.message)
      return response
    },
    onSuccess: (_, variables) => {
      if (variables.method === 'email') {
        toast.success('Export sent via email successfully')
      } else {
        toast.success('Export downloaded successfully')
      }
    },
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : 'Export failed'),
  })
}
