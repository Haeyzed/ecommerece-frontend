'use client'

/**
 * SMS Settings API Hooks
 *
 * Client-side hooks for listing and updating SMS providers.
 *
 * @module features/settings/sms/api
 */

import { useApiClient } from '@/lib/api/api-client-client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { SmsProvider } from './types'

export const smsSettingKeys = {
  all: ['sms-setting'] as const,
  list: () => [...smsSettingKeys.all, 'list'] as const,
  detail: (id: number | null) => [...smsSettingKeys.all, 'detail', id] as const,
}

export function useSmsProviders() {
  const { api, sessionStatus } = useApiClient()
  const query = useQuery({
    queryKey: smsSettingKeys.list(),
    queryFn: async () => {
      const response = await api.get<SmsProvider[] | { data?: SmsProvider[] }>('/settings/sms')
      const data = response.data
      if (Array.isArray(data)) return data
      const list = (data as { data?: SmsProvider[] })?.data
      return Array.isArray(list) ? list : []
    },
    enabled: sessionStatus !== 'loading',
  })
  return {
    ...query,
    isSessionLoading: sessionStatus === 'loading',
  }
}

export function useSmsProvider(id: number | null) {
  const { api, sessionStatus } = useApiClient()
  return useQuery({
    queryKey: smsSettingKeys.detail(id),
    queryFn: async () => {
      if (id == null) return null
      const response = await api.get<SmsProvider>(`/settings/sms/${id}`)
      return response.data ?? null
    },
    enabled: sessionStatus !== 'loading' && id != null,
  })
}

export function useUpdateSmsProvider() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: { details?: Record<string, string>; active?: boolean } }) => {
      const response = await api.put<SmsProvider>(`/settings/sms/${id}`, data)
      if (!response.success || !response.data) {
        throw new Error(response.message ?? 'Failed to update SMS provider')
      }
      return response.data
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: smsSettingKeys.list() })
      queryClient.invalidateQueries({ queryKey: smsSettingKeys.detail(id) })
      toast.success('SMS provider updated successfully')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to update SMS provider')
    },
  })
}
