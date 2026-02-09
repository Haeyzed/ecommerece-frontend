/**
 * General Settings Types
 *
 * Type definitions for General Setting entity.
 * Aligns with the Laravel API GeneralSettingResource.
 *
 * @module features/settings/general/types
 */

export interface GeneralSetting {
  id: number
  site_title: string | null
  site_logo: string | null
  site_logo_url: string | null
  favicon: string | null
  favicon_url: string | null
  is_rtl: boolean
  is_zatca: boolean
  company_name: string | null
  vat_registration_number: string | null
  currency: string | null
  currency_position: string | null
  decimal: number | null
  staff_access: string | null
  without_stock: string | null
  is_packing_slip: boolean
  date_format: string | null
  developed_by: string | null
  invoice_format: string | null
  state: number | null
  default_margin_value: number | null
  font_css: string | null
  pos_css: string | null
  auth_css: string | null
  custom_css: string | null
  expiry_alert_days: number | null
  disable_signup: boolean
  disable_forgot_password: boolean
  maintenance_allowed_ips: string | null
  margin_type: number | null
  timezone: string | null
  show_products_details_in_sales_table: boolean
  show_products_details_in_purchase_table: boolean
  created_at: string | null
  updated_at: string | null
}
