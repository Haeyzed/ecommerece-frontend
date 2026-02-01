/**
 * =====================================================
 * Tax Types
 * -----------------------------------------------------
 * TypeScript interfaces for Tax entities.
 *
 * Source of truth:
 * - Inferred from Laravel `TaxResource` / `TaxRequest`
 *
 * Responsibilities:
 * - Define backend data contract for taxes
 * - Provide type safety for forms, API responses, and mutations
 * - Align frontend types with Laravel resource output
 * =====================================================
 */

/**
 * Represents a Tax entity returned from the API.
 *
 * Used in:
 * - API responses
 * - TanStack Query hooks
 * - Frontend display and tables
 */
export interface Tax {
  /** Unique identifier of the tax */
  id: number;

  /** Display name of the tax. Example: "VAT", "Sales Tax" */
  name: string;

  /** Tax rate as a percentage. Example: 7.5, 20 */
  rate: number;

  /** Indicates if the tax is currently active */
  is_active: boolean;

  /** Optional WooCommerce tax identifier for external mapping */
  woocommerce_tax_id: number | null;

  /** Timestamp of creation in ISO 8601 format */
  created_at: string | null;

  /** Timestamp of last update in ISO 8601 format */
  updated_at: string | null;
}

/**
 * Represents Tax data submitted via a form.
 *
 * Used in:
 * - Create / Update mutations
 * - React Hook Form validation
 */
export interface TaxFormData {
  /** Display name of the tax */
  name: string;

  /** Tax rate as a percentage */
  rate: number;

  /** Optional flag indicating active status */
  is_active?: boolean | null;

  /** Optional WooCommerce tax identifier */
  woocommerce_tax_id?: number | null;
}
