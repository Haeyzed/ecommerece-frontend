/**
 * Payment Gateway Setting Schemas
 * Validation for payment gateway update payload. Mirrors PaymentGatewayRequest.
 * @module features/settings/payment-gateway/schemas
 */

import { z } from 'zod'

export const paymentGatewayModuleStatusSchema = z.object({
  pos: z.boolean().optional(),
  ecommerce: z.boolean().optional(),
})

export const paymentGatewayUpdateSchema = z.object({
  details: z.record(z.string(), z.string()).optional(),
  active: z.boolean().optional(),
  module_status: paymentGatewayModuleStatusSchema.optional(),
})

export type PaymentGatewayUpdateData = z.infer<typeof paymentGatewayUpdateSchema>
