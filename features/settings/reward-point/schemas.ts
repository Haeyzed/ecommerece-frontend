/**
 * Reward Point Setting Schemas
 *
 * Validation for the reward point setting form.
 * Mirrors server-side RewardPointSettingRequest rules.
 *
 * @module features/settings/reward-point/schemas
 */

import { z } from 'zod'

export const rewardPointSettingSchema = z.object({
  is_active: z.boolean().optional(),
  per_point_amount: z.number().min(0).nullable().optional(),
  minimum_amount: z.number().min(0).nullable().optional(),
  duration: z.number().int().min(0).nullable().optional(),
  type: z.enum(['days', 'months', 'years']).nullable().optional(),
  redeem_amount_per_unit_rp: z.number().min(0).nullable().optional(),
  min_order_total_for_redeem: z.number().min(0).nullable().optional(),
  min_redeem_point: z.number().int().min(0).nullable().optional(),
  max_redeem_point: z.number().int().min(0).nullable().optional(),
})

export type RewardPointSettingFormData = z.infer<typeof rewardPointSettingSchema>
