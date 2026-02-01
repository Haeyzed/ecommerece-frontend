/**
 * =====================================================
 * Tax Zod Schema
 * -----------------------------------------------------
 * Client-side validation schema for Tax forms.
 *
 * Source of truth:
 * - Inferred from Laravel `TaxRequest` validation rules
 * - Used with React Hook Form via `zodResolver`
 *
 * Responsibilities:
 * - Enforce required fields and value constraints
 * - Provide user-friendly validation messages
 * - Ensure type-safety via schema inference
 * =====================================================
 */

import { z } from "zod";

/**
 * Tax form validation schema.
 *
 * Field rules:
 * - `name`: Required, max 255 characters
 * - `rate`: Percentage value between 0 and 100
 * - `is_active`: Optional nullable boolean flag
 * - `woocommerce_tax_id`: Optional nullable integer (external reference)
 */
export const taxSchema = z.object({
  /**
   * Display name of the tax.
   * Example: "VAT", "Sales Tax"
   */
  name: z
    .string()
    .min(1, "Tax name is required")
    .max(255),

  /**
   * Tax rate expressed as a percentage.
   * Example: 7.5, 20
   */
  rate: z
    .number()
    .min(0, "Rate must be at least 0")
    .max(100, "Rate cannot exceed 100"),

  /**
   * Whether the tax is currently active.
   * Nullable to match backend defaults.
   */
  is_active: z
    .boolean()
    .nullable()
    .optional(),

  /**
   * Optional WooCommerce tax identifier
   * for external system mapping.
   */
  woocommerce_tax_id: z
    .number()
    .int()
    .nullable()
    .optional(),
});

/**
 * Inferred TypeScript type for Tax form data.
 *
 * Use this type:
 * - In form components
 * - In mutation hooks
 * - For payload validation consistency
 */
export type TaxFormData = z.infer<typeof taxSchema>;
