/**
 * Tax Schemas
 *
 * Zod validation schemas for Tax-related forms and input data.
 * Ensures data integrity before sending to the API.
 *
 * @module features/taxes/schemas
 */

import { z } from "zod";

/**
 * taxSchema
 *
 * Zod schema for validating tax creation and update forms.
 *
 * Rules:
 * - `name`: Required string, 1-255 characters.
 * - `rate`: Required number, 0-100 (percentage).
 * - `is_active`: Optional boolean.
 * - `woocommerce_tax_id`: Optional integer for external mapping.
 */
export const taxSchema = z.object({
  name: z
    .string()
    .min(1, "Tax name is required")
    .max(255),
  rate: z
    .number()
    .min(0, "Rate must be at least 0")
    .max(100, "Rate cannot exceed 100"),
  is_active: z
    .boolean()
    .nullable()
    .optional(),
  woocommerce_tax_id: z
    .number()
    .int()
    .nullable()
    .optional(),
});

/**
 * TaxFormData
 *
 * TypeScript type inferred from the `taxSchema`.
 * Represents the shape of the data used in Tax forms.
 */
export type TaxFormData = z.infer<typeof taxSchema>;