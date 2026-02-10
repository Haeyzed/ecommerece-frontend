'use client'

/**
 * Reward Point Setting API Hooks
 *
 * @module features/settings/reward-point/api
 */

import { useApiClient } from '@/lib/api/api-client-client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { RewardPointSetting } from './types'
import type { RewardPointSettingFormData } from './schemas'

export const rewardPointSettingKeys = {
  all: ['reward-point-setting'] as const,
  detail: () => [...rewardPointSettingKeys.all, 'detail'] as const,
}

export function useRewardPointSetting() {
  const { api, sessionStatus } = useApiClient()
  const query = useQuery({
    queryKey: rewardPointSettingKeys.detail(),
    queryFn: async () => {
      const response = await api.get<RewardPointSetting>('/settings/reward-points')
      return response.data ?? null
    },
    enabled: sessionStatus !== 'loading',
  })
  return {
    ...query,
    isSessionLoading: sessionStatus === 'loading',
  }
}

export function useUpdateRewardPointSetting() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: RewardPointSettingFormData) => {
      const body: Record<string, unknown> = {
        is_active: data.is_active ?? false,
      }
      if (data.per_point_amount != null) body.per_point_amount = data.per_point_amount
      if (data.minimum_amount != null) body.minimum_amount = data.minimum_amount
      if (data.duration != null) body.duration = data.duration
      if (data.type != null) body.type = data.type
      if (data.redeem_amount_per_unit_rp != null) body.redeem_amount_per_unit_rp = data.redeem_amount_per_unit_rp
      if (data.min_order_total_for_redeem != null) body.min_order_total_for_redeem = data.min_order_total_for_redeem
      if (data.min_redeem_point != null) body.min_redeem_point = data.min_redeem_point
      if (data.max_redeem_point != null) body.max_redeem_point = data.max_redeem_point

      const response = await api.put<RewardPointSetting>('/settings/reward-points', body)
      if (!response.success || !response.data) {
        throw new Error(response.message ?? 'Failed to update reward point setting')
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rewardPointSettingKeys.detail() })
      toast.success('Reward point setting updated successfully')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to update reward point setting')
    },
  })
}
