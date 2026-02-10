'use client'

/**
 * Payment Gateway Setting API Hooks
 *
 * @module features/settings/payment-gateway/api
 */

import { useApiClient } from '@/lib/api/api-client-client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { PaymentGateway } from './types'
import type { PaymentGatewayUpdateData } from './schemas'

export const paymentGatewaySettingKeys = {
  all: ['payment-gateway-setting'] as const,
  list: () => [...paymentGatewaySettingKeys.all, 'list'] as const,
  detail: (id: number | null) => [...paymentGatewaySettingKeys.all, 'detail', id] as const,
}

export function usePaymentGateways() {
  const { api, sessionStatus } = useApiClient()
  const query = useQuery({
    queryKey: paymentGatewaySettingKeys.list(),
    queryFn: async () => {
      const response = await api.get<PaymentGateway[]>('/settings/payment-gateways')
      const raw = response.data
      if (Array.isArray(raw)) return raw
      const list = (raw as { data?: PaymentGateway[] } | null)?.data
      return Array.isArray(list) ? list : []
    },
    enabled: sessionStatus !== 'loading',
  })
  return {
    ...query,
    isSessionLoading: sessionStatus === 'loading',
  }
}

export function usePaymentGateway(id: number | null) {
  const { api, sessionStatus } = useApiClient()
  return useQuery({
    queryKey: paymentGatewaySettingKeys.detail(id),
    queryFn: async () => {
      if (id == null) return null
      const response = await api.get<PaymentGateway>(`/settings/payment-gateways/${id}`)
      return response.data ?? null
    },
    enabled: sessionStatus !== 'loading' && id != null,
  })
}

export function useUpdatePaymentGateway() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: PaymentGatewayUpdateData }) => {
      const body: Record<string, unknown> = {}
      if (data.details != null) body.details = data.details
      if (data.active != null) body.active = data.active
      if (data.module_status != null) body.module_status = data.module_status

      const response = await api.put<PaymentGateway>(`/settings/payment-gateways/${id}`, body)
      if (!response.success || !response.data) {
        throw new Error(response.message ?? 'Failed to update payment gateway')
      }
      return response.data
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: paymentGatewaySettingKeys.list() })
      queryClient.invalidateQueries({ queryKey: paymentGatewaySettingKeys.detail(id) })
      toast.success('Payment gateway updated successfully')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to update payment gateway')
    },
  })
}
