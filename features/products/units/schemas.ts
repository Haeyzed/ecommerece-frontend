/**
 * Units Schemas
 *
 * Validation schemas and type inference for unit forms.
 * Uses Zod for client-side validation that mirrors server-side rules.
 *
 * @module features/products/units/schemas
 */

import { z } from "zod";

/**
 * unitSchema
 *
 * Zod validation schema for creating and updating units.
 *
 * Validation rules:
 * - `name`: Required, max 255 chars
 * - `code`: Required, max 50 chars
 * - `base_unit`: Optional number (nullable)
 * - `operator`: Optional string (nullable), usually '*', '/', '+', '-'
 * - `operation_value`: Optional number (nullable)
 * - `is_active`: Optional boolean
 */
export const unitSchema = z.object({
  name: z.string().min(1, "Unit name is required").max(255, "Name is too long"),
  code: z.string().min(1, "Unit code is required").max(50, "Code is too long"),
  base_unit: z.number().nullable().optional(),
  operator: z.string().nullable().optional(),
  operation_value: z.number().nullable().optional(),
  is_active: z.boolean().nullable().optional(),
});

/**
 * unitImportSchema
 * * Validation for the file import form.
 */
export const unitImportSchema = z.object({
  file: z
    .array(z.custom<File>())
    .min(1, "Please select a file to import")
    .max(1, "Please select only one file")
    .refine((files) => files.length > 0, "File is required"),
});

/**
 * UnitFormData
 *
 * Type definition inferred from the Zod schema.
 * Used for type-safe form handling.
 */
export type UnitFormData = z.infer<typeof unitSchema>;
export type UnitImportFormData = z.infer<typeof unitImportSchema>;
