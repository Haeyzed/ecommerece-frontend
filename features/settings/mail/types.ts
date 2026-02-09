/**
 * Mail Settings Types
 *
 * Type definitions for Mail Setting entity.
 * Aligns with the Laravel API MailSettingResource.
 * Password is masked in API response.
 *
 * @module features/settings/mail/types
 */

export interface MailSetting {
  id: number
  driver: string | null
  host: string | null
  port: string | null
  from_address: string | null
  from_name: string | null
  username: string | null
  /** Masked as ******** in API; never use for form pre-fill */
  password: string | null
  encryption: string | null
  is_default: boolean | null
  created_at: string | null
  updated_at: string | null
}
