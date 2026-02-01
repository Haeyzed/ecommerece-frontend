/**
 * Unit Types
 *
 * Type definitions for Unit entities and related data structures.
 * Aligns with the backend API resource structure, including recursive relationships.
 *
 * @module features/units/types
 */

/**
 * Unit
 *
 * Represents the full Unit entity returned by the API.
 * Includes conversion logic fields if the unit is a sub-unit.
 */
export interface Unit {
  id: number;
  code: string;
  name: string;
  base_unit: number | null;
  base_unit_relation?: {
    id: number;
    code: string;
    name: string;
  } | null;
  operator: string | null;
  operation_value: number | null;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
}

/**
 * UnitFormData
 *
 * Interface for data submitted when creating or updating a unit.
 * Defines the raw payload structure expected by mutation functions.
 */
export interface UnitFormData {
  code: string;
  name: string;
  base_unit?: number | null;
  operator?: string | null;
  operation_value?: number | null;
  is_active?: boolean | null;
}