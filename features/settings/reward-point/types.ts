/**
 * Reward Point Setting Types
 *
 * Aligns with the Laravel API RewardPointSettingResource.
 *
 * @module features/settings/reward-point/types
 */

export interface RewardPointSetting {
  id: number
  per_point_amount: number | null
  minimum_amount: number | null
  duration: number | null
  type: string | null
  is_active: boolean
  redeem_amount_per_unit_rp: number | null
  min_order_total_for_redeem: number | null
  min_redeem_point: number | null
  max_redeem_point: number | null
  created_at: string | null
  updated_at: string | null
}
