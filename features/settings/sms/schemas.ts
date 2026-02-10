/**
 * SMS Settings Schemas
 *
 * Validation for updating an SMS provider.
 *
 * @module features/settings/sms/schemas
 */

import { z } from 'zod'

export const smsSettingUpdateSchema = z.object({
  details: z.record(z.string(), z.string()).optional(),
  active: z.boolean().optional(),
})

export type SmsSettingUpdateData = z.infer<typeof smsSettingUpdateSchema>
