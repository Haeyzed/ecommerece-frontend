/**
 * Tax Types
 *
 * Type definitions for Tax entities and related data structures.
 * Aligns with the backend API resource structure.
 *
 * @module features/taxes/types
 */

/**
 * Tax
 *
 * Represents the full Tax entity returned by the API.
 * Used in data tables and detail views.
 */
export interface Tax {
  id: number;
  name: string;
  rate: number;
  is_active: boolean;
  woocommerce_tax_id: number | null;
  created_at: string | null;
  updated_at: string | null;
}

/**
 * TaxFormData
 *
 * Interface for data submitted when creating or updating a tax.
 * Defines the raw payload structure expected by mutation functions.
 */
export interface TaxFormData {
  name: string;
  rate: number;
  is_active?: boolean | null;
  woocommerce_tax_id?: number | null;
}