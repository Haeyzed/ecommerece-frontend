/**
 * API Type Definitions
 *
 * TypeScript interfaces representing the data contracts between the frontend
 * and the Laravel backend API. Includes response structures, pagination metadata,
 * and authentication payloads.
 *
 * @module lib/api/api-types
 */

/**
 * Pagination metadata returned by paginated API endpoints.
 * Aligns with Laravel's default pagination response structure.
 */
export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

/**
 * The raw response structure returned directly from the backend API.
 *
 * @template T - The type of the `data` payload.
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
  meta?: PaginationMeta;
  errors?: Record<string, string[]>;
}

/**
 * A normalized response structure used internally by the frontend application.
 * Maps the backend's `success` boolean to a more conventional `success` property.
 *
 * @template T - The type of the `data` payload.
 */
export interface NormalizedApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
  meta?: PaginationMeta;
  errors?: Record<string, string[]>;
}