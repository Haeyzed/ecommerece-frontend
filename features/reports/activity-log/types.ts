/**
 * Audit Log Types
 *
 * Type definitions for Laravel Auditing Audit entities.
 * Matches the full audit structure from owen-it/laravel-auditing.
 *
 * @module features/reports/activity-log/types
 */

/** Nested user object when loaded */
export interface AuditUser {
  id: number
  name: string | null
}

/**
 * Audit
 *
 * Full audit record from Laravel Auditing.
 * Standard structure per owen-it/laravel-auditing.
 */
export interface Audit {
  id: number
  user_type: string | null
  user_id: number | null
  user: AuditUser | null
  event: string
  auditable_type: string
  auditable_id: string | number
  old_values: Record<string, unknown> | null
  new_values: Record<string, unknown> | null
  url: string | null
  ip_address: string | null
  user_agent: string | null
  tags: string | null
  created_at: string | null
  updated_at: string | null
}
