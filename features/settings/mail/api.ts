'use client'

/**
 * Mail Settings API Hooks
 *
 * Client-side hooks for fetching and updating mail settings.
 *
 * @module features/settings/mail/api
 */

import { useApiClient } from '@/lib/api/api-client-client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { MailSetting } from './types'
import type { MailSettingFormData } from './schemas'

export const mailSettingKeys = {
  all: ['mail-setting'] as const,
  detail: () => [...mailSettingKeys.all, 'detail'] as const,
}

export function useMailSetting() {
  const { api, sessionStatus } = useApiClient()
  const query = useQuery({
    queryKey: mailSettingKeys.detail(),
    queryFn: async () => {
      const response = await api.get<MailSetting>('/settings/mail')
      return response.data ?? null
    },
    enabled: sessionStatus !== 'loading',
  })
  return {
    ...query,
    isSessionLoading: sessionStatus === 'loading',
  }
}

export function useUpdateMailSetting() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: MailSettingFormData) => {
      const body: Record<string, unknown> = {
        driver: data.driver,
        host: data.host,
        port: data.port,
        from_address: data.from_address,
        from_name: data.from_name,
        username: data.username,
        encryption: data.encryption,
        send_test: data.send_test ?? false,
      }
      if (data.password != null && data.password.trim() !== '') {
        body.password = data.password.trim()
      }
      const response = await api.put<MailSetting>('/settings/mail', body)
      if (!response.success || !response.data) {
        throw new Error(response.message ?? 'Failed to update mail setting')
      }
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: mailSettingKeys.detail() })
      const message = variables.send_test
        ? 'Mail setting updated and test email sent'
        : 'Mail setting updated successfully'
      toast.success(message)
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to update mail setting')
    },
  })
}

export function useSendTestMail() {
  const { api } = useApiClient()

  return useMutation({
    mutationFn: async () => {
      const response = await api.post<unknown>('/settings/mail/test')
      if (!response.success) {
        throw new Error(response.message ?? 'Failed to send test email')
      }
      return response.data
    },
    onSuccess: () => {
      toast.success('Test email sent successfully')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to send test email')
    },
  })
}
