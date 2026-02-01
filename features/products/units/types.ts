/**
 * =====================================================
 * Unit Types
 * -----------------------------------------------------
 * TypeScript interfaces for Unit entities.
 *
 * Source of truth:
 * - Inferred from Laravel `UnitResource` / `UnitRequest`
 *
 * Responsibilities:
 * - Define backend data contract for units
 * - Provide type safety for forms, API responses, and mutations
 * - Align frontend types with Laravel resource output
 * =====================================================
 */

/**
 * Represents a Unit entity returned from the API.
 *
 * Used in:
 * - API responses
 * - TanStack Query hooks
 * - Frontend display and tables
 */
export interface Unit {
  /** Unique identifier of the unit */
  id: number;

  /** Short code (e.g. "kg", "L", "pcs") */
  code: string;

  /** Display name of the unit */
  name: string;

  /** Base unit ID for conversion. Null for base units */
  base_unit: number | null;

  /** Base unit relation when expanded (id, code, name) */
  base_unit_relation?: {
    id: number;
    code: string;
    name: string;
  } | null;

  /** Arithmetic operator for conversion (*, /, +, -) */
  operator: string | null;

  /** Numeric value for conversion */
  operation_value: number | null;

  /** Indicates if the unit is currently active */
  is_active: boolean;

  /** Timestamp of creation in ISO 8601 format */
  created_at: string | null;

  /** Timestamp of last update in ISO 8601 format */
  updated_at: string | null;
}

/**
 * Represents Unit data submitted via a form.
 *
 * Used in:
 * - Create / Update mutations
 * - React Hook Form validation
 */
export interface UnitFormData {
  /** Short code for the unit */
  code: string;

  /** Display name of the unit */
  name: string;

  /** Base unit ID for conversion */
  base_unit?: number | null;

  /** Arithmetic operator for conversion */
  operator?: string | null;

  /** Numeric value for conversion */
  operation_value?: number | null;

  /** Optional flag indicating active status */
  is_active?: boolean | null;
}
