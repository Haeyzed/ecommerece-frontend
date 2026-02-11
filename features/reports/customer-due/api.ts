'use client'

import { useApiClient } from '@/lib/api/api-client-client'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import type {
  CustomerDueReportRow,
  CustomerDueReportMeta,
} from './types'

export const customerDueReportKeys = {
  all: ['reports', 'customer-due'] as const,
  list: (params: Record<string, unknown>) =>
    [...customerDueReportKeys.all, params] as const,
}

export interface UseCustomerDueReportParams {
  start_date: string
  end_date: string
  customer_id?: number | null
  page?: number
  per_page?: number
}

export function useCustomerDueReport(params: UseCustomerDueReportParams | null) {
  const { api, sessionStatus } = useApiClient()

  const query = useQuery({
    queryKey: customerDueReportKeys.list((params ?? {}) as Record<string, unknown>),
    queryFn: async () => {
      const response = await api.get<CustomerDueReportRow[]>(
        '/reports/customer-due',
        {
          params: {
            start_date: params!.start_date,
            end_date: params!.end_date,
            customer_id: params!.customer_id ?? undefined,
            page: params!.page ?? 1,
            per_page: params!.per_page ?? 15,
          },
        }
      )
      return response
    },
    enabled:
      sessionStatus !== 'loading' &&
      params !== null &&
      !!params.start_date &&
      !!params.end_date,
  })

  const rows: CustomerDueReportRow[] = query.data?.data ?? []
  const meta: CustomerDueReportMeta | null = query.data?.meta ?? null

  return {
    ...query,
    isSessionLoading: sessionStatus === 'loading',
    rows,
    meta,
  }
}

export type CustomerDueReportExportParams = {
  start_date: string
  end_date: string
  customer_id?: number | null
  format: 'excel' | 'pdf'
  method: 'download' | 'email'
  columns: string[]
  user_id?: number
}

export function useCustomerDueReportExport() {
  const { api } = useApiClient()

  return useMutation({
    mutationFn: async (params: CustomerDueReportExportParams) => {
      if (params.method === 'download') {
        const blob = await api.postBlob('/reports/customer-due/export', params)
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `customer-due-report-${Date.now()}.${params.format === 'pdf' ? 'pdf' : 'xlsx'}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        return { message: 'Export downloaded successfully' }
      }
      const response = await api.post('/reports/customer-due/export', params)
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
