/**
 * Taxes Schemas
 *
 * Validation schemas and type inference for tax forms.
 * Uses Zod for client-side validation that mirrors server-side rules.
 *
 * @module features/settings/taxes/schemas
 */

import { z } from "zod";

/**
 * taxSchema
 *
 * Zod validation schema for creating and updating taxes.
 *
 * Validation rules:
 * - `name`: Required, max 255 chars
 * - `rate`: Required number, min 0
 * - `is_active`: Optional boolean
 * - `woocommerce_tax_id`: Optional number (nullable)
 */
export const taxSchema = z.object({
  name: z.string().min(1, "Tax name is required").max(255, "Name is too long"),
  rate: z.coerce
    .number({ invalid_type_error: "Rate must be a number" })
    .min(0, "Rate must be 0 or greater"),
  is_active: z.boolean().nullable().optional(),
  woocommerce_tax_id: z.coerce.number().nullable().optional(),
});

/**
 * TaxFormData
 *
 * Type definition inferred from the Zod schema.
 * Used for type-safe form handling.
 */
export type TaxFormData = z.infer<typeof taxSchema>;