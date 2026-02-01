/**
 * Unit Schemas
 *
 * Zod validation schemas for Unit-related forms and input data.
 * Defines structure for standard units and sub-units with conversion logic.
 *
 * @module features/units/schemas
 */

import { z } from "zod";

/**
 * unitSchema
 *
 * Zod schema for validating unit creation and update forms.
 *
 * Rules:
 * - `code`: Required string, 1-255 characters (e.g., "kg").
 * - `name`: Required string, 1-255 characters (e.g., "Kilogram").
 * - `base_unit`: Optional integer ID for the parent unit (if this is a sub-unit).
 * - `operator`: Optional arithmetic operator (*, /, +, -) for conversion.
 * - `operation_value`: Optional non-negative number for conversion.
 * - `is_active`: Optional boolean.
 */
export const unitSchema = z.object({
  code: z.string().min(1, "Unit code is required").max(255),
  name: z.string().min(1, "Unit name is required").max(255),
  base_unit: z.number().int().nullable().optional(),
  operator: z.enum(["*", "/", "+", "-"]).nullable().optional(),
  operation_value: z.number().min(0).nullable().optional(),
  is_active: z.boolean().nullable().optional(),
});

/**
 * UnitFormData
 *
 * TypeScript type inferred from the `unitSchema`.
 * Represents the shape of the data used in Unit forms.
 */
export type UnitFormData = z.infer<typeof unitSchema>;