/**
 * Unit Types
 *
 * Type definitions for Unit entities and related data structures.
 * Aligns with the backend API resource structure.
 *
 * @module features/products/units/types
 */

/**
 * UnitOption
 *
 * A simplified unit object used for selection inputs.
 */
export interface UnitOption {
  value: number;
  label: string;
  code: string;
}

/**
 * UnitStatus
 * * distinct union type for unit statuses.
 */
export type UnitStatus = 'active' | 'inactive';

/**
 * Unit
 *
 * Represents the full Unit entity returned by the API.
 * Used in data tables and detail views.
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
  status: UnitStatus;
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