/**
 * Categories Types
 *
 * Type definitions for Category entities and related data structures.
 * These types align with the Laravel backend API resources.
 *
 * @module features/categories/types
 */

/**
 * CategoryOption
 *
 * A simplified category object used for selection inputs (e.g., parent category dropdown).
 */
export interface CategoryOption {
  value: number;
  label: string;
}

/**
 * Category
 *
 * Represents the full Category entity returned by the API.
 * Used in data tables, detail views, and API responses.
 */
export interface Category {
  id: number;
  name: string;
  slug: string | null;
  short_description: string | null;
  page_title: string | null;
  image: string | null;
  image_url: string | null;
  icon: string | null;
  icon_url: string | null;
  parent_id: number | null;
  parent_name: string | null;
  is_active: boolean;
  status: CategoryStatus;
  featured: boolean;
  featured_status: CategoryFeaturedStatus;
  is_sync_disable: boolean;
  sync_status: CategorySyncStatus;
  woocommerce_category_id: number | null;
  is_root: boolean;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
}

/**
 * CategoryFormData
 *
 * Interface for data submitted when creating or updating a category.
 * Note: This interface describes the raw values, often used in API mutation payloads.
 * For form state management, prefer the Zod inferred type from `schemas.ts`.
 */
export interface CategoryFormData {
  name: string;
  slug?: string | null;
  short_description?: string | null;
  page_title?: string | null;
  image?: File[] | null;
  icon?: File[] | null;
  parent_id?: number | null;
  is_active?: boolean | null;
  featured?: boolean | null;
  is_sync_disable?: boolean | null;
  woocommerce_category_id?: number | null;
}

/**
 * CategoryStatus
 * Distinct union type for Category statuses.
 */
export type CategoryStatus = 'active' | 'inactive';

/**
 * CategoryFeaturedStatus
 * Distinct union type for Category featured statuses.
 */
export type CategoryFeaturedStatus = 'featured' | 'not featured';

/**
 * CategorySyncStatus
 * Distinct union type for Category sync statuses.
 */
export type CategorySyncStatus = 'enabled' | 'disabled';