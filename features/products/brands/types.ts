/**
 * Brands Types
 *
 * Type definitions for Brand entities and related data structures.
 * These types align with the Laravel backend API resources.
 *
 * @module features/brands/types
 */

/**
 * Brand
 *
 * Represents the full Brand entity returned by the API.
 * Used in data tables, detail views, and API responses.
 */
export interface Brand {
  id: number;
  name: string;
  slug: string | null;
  short_description: string | null;
  page_title: string | null;
  image: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
}

/**
 * BrandFormData
 *
 * Interface for data submitted when creating or updating a brand.
 * Note: This interface describes the raw values, often used in API mutation payloads.
 * For form state management, prefer the Zod inferred type from `schemas.ts`.
 */
export interface BrandFormData {
  name: string;
  slug?: string | null;
  short_description?: string | null;
  page_title?: string | null;
  image?: File[] | null;
  is_active?: boolean | null;
}