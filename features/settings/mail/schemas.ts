/**
 * Mail Settings Schemas
 *
 * Validation schemas for the mail setting form.
 * Mirrors server-side MailSettingRequest rules.
 *
 * @module features/settings/mail/schemas
 */

import { z } from 'zod'

export const mailSettingSchema = z.object({
  driver: z.string().min(1, 'Mail driver is required').max(50),
  host: z.string().min(1, 'Mail host is required').max(255),
  port: z.string().min(1, 'Mail port is required').max(10),
  from_address: z.string().min(1, 'From address is required').email('Invalid email').max(255),
  from_name: z.string().min(1, 'From name is required').max(255),
  username: z.string().min(1, 'Username is required').max(255),
  password: z.string().max(255).optional(),
  encryption: z.string().min(1, 'Encryption is required').max(50),
  send_test: z.boolean().optional(),
})

export type MailSettingFormData = z.infer<typeof mailSettingSchema>
