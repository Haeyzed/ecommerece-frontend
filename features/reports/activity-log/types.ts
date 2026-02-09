/**
 * Activity Log Types
 *
 * Type definitions for ActivityLog entities and related data structures.
 * These types align with the Laravel backend API resources.
 *
 * @module features/reports/activity-log/types
 */

/**
 * ActivityLog
 *
 * Represents the full ActivityLog entity returned by the API.
 * Used in data tables and API responses.
 */
export interface ActivityLog {
  id: number
  date: string | null
  user_id: number
  user_name: string | null
  action: string
  reference_no: string | null
  item_description: string | null
  created_at: string | null
  updated_at: string | null
}
