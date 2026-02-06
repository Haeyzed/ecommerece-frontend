/**
 * Taxes Schemas
 *
 * Validation schemas and type inference for tax forms.
 * Uses Zod for client-side validation that mirrors server-side rules.
 *
 * @module features/products/taxes/schemas
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
  rate: z.number().min(0, "Rate must be 0 or greater"),
  is_active: z.boolean().nullable().optional(),
  woocommerce_tax_id: z.number().int().nullable().optional(),
});

/**
 * taxImportSchema
 * * Validation for the file import form.
 */
export const taxImportSchema = z.object({
  file: z
    .array(z.custom<File>())
    .min(1, "Please select a file to import")
    .max(1, "Please select only one file")
    .refine((files) => files.length > 0, "File is required"),
})

/**
 * TaxFormData
 *
 * Type definition inferred from the Zod schema.
 * Used for type-safe form handling.
 */
export type TaxFormData = z.infer<typeof taxSchema>;
export type TaxImportFormData = z.infer<typeof taxImportSchema>;