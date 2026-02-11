'use client'

import { useApiClient } from '@/lib/api/api-client-client'
import { useQuery } from '@tanstack/react-query'
import type { CustomerDueReportPayload } from './types'

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
    queryKey: customerDueReportKeys.list(params ?? {}),
    queryFn: async () => {
      const response = await api.get<CustomerDueReportPayload>(
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

  return {
    ...query,
    isSessionLoading: sessionStatus === 'loading',
    rows: query.data?.data?.data ?? [],
    meta: query.data?.data?.meta ?? null,
  }
}
