/**
 * =====================================================
 * Unit Zod Schema
 * -----------------------------------------------------
 * Client-side validation schema for Unit forms.
 *
 * Source of truth:
 * - Inferred from Laravel `UnitRequest` validation rules
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
 * Unit form validation schema.
 *
 * Field rules:
 * - `code`: Required, max 255 characters
 * - `name`: Required, max 255 characters
 * - `base_unit`: Optional nullable integer (parent unit for conversion)
 * - `operator`: Optional enum "*" | "/" | "+" | "-" for conversion
 * - `operation_value`: Optional number >= 0 for conversion
 * - `is_active`: Optional nullable boolean flag
 */
export const unitSchema = z.object({
  /**
   * Short code for the unit (e.g. "kg", "L", "pcs").
   */
  code: z.string().min(1, "Unit code is required").max(255),

  /**
   * Display name of the unit.
   */
  name: z.string().min(1, "Unit name is required").max(255),

  /**
   * Base unit ID for conversion (e.g. sub-units).
   * Nullable for base units.
   */
  base_unit: z.number().int().nullable().optional(),

  /**
   * Arithmetic operator for conversion (*, /, +, -).
   */
  operator: z.enum(["*", "/", "+", "-"]).nullable().optional(),

  /**
   * Numeric value used with operator for conversion.
   * Must be >= 0.
   */
  operation_value: z.number().min(0).nullable().optional(),

  /**
   * Whether the unit is currently active.
   * Nullable to match backend defaults.
   */
  is_active: z.boolean().nullable().optional(),
});

/**
 * Inferred TypeScript type for Unit form data.
 *
 * Use this type:
 * - In form components
 * - In mutation hooks
 * - For payload validation consistency
 */
export type UnitFormData = z.infer<typeof unitSchema>;
