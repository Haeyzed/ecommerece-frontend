/**
 * Warehouse Types
 *
 * Type definitions for Warehouse entities and related data structures.
 * These types align with the Laravel backend API resources.
 *
 * @module features/settings/warehouse/types
 */

/**
 * Warehouse
 *
 * Represents the full Warehouse entity returned by the API.
 * Used in data tables, detail views, and API responses.
 */
export interface Warehouse {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
}

/**
 * WarehouseFormData
 *
 * Interface for data submitted when creating or updating a warehouse.
 */
export interface WarehouseFormData {
  name: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  is_active?: boolean | null;
}
