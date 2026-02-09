/**
 * General Settings Schemas
 *
 * Validation schemas for the general setting form.
 * Mirrors server-side GeneralSettingRequest rules.
 * Follows the same pattern as brands schema.
 *
 * @module features/settings/general/schemas
 */

import { z } from 'zod'

export const generalSettingSchema = z.object({
  site_title: z.string().min(1, 'System title is required').max(255),
  site_logo: z
    .array(z.custom<File>())
    .max(1, 'Please select only one image')
    .optional(),
  favicon: z
    .array(z.custom<File>())
    .max(1, 'Please select only one image')
    .optional(),
  is_rtl: z.boolean().nullable().optional(),
  is_zatca: z.boolean().nullable().optional(),
  company_name: z.string().max(255, 'Company name is too long').nullable().optional(),
  vat_registration_number: z.string().max(255).nullable().optional(),
  currency: z.string().max(255).nullable().optional(),
  currency_position: z.enum(['prefix', 'suffix']).nullable().optional(),
  decimal: z.number().int().min(0).max(6).nullable().optional(),
  staff_access: z.enum(['all', 'own', 'warehouse']).nullable().optional(),
  without_stock: z.enum(['yes', 'no']).nullable().optional(),
  is_packing_slip: z.boolean().nullable().optional(),
  date_format: z.string().max(50).nullable().optional(),
  developed_by: z.string().max(255).nullable().optional(),
  invoice_format: z.enum(['standard', 'gst']).nullable().optional(),
  state: z.union([z.literal(1), z.literal(2)]).nullable().optional(),
  default_margin_value: z.number().min(0).nullable().optional(),
  font_css: z.string().nullable().optional(),
  pos_css: z.string().nullable().optional(),
  auth_css: z.string().nullable().optional(),
  custom_css: z.string().nullable().optional(),
  expiry_alert_days: z.number().int().min(0).nullable().optional(),
  disable_signup: z.boolean().nullable().optional(),
  disable_forgot_password: z.boolean().nullable().optional(),
  maintenance_allowed_ips: z.string().max(500).nullable().optional(),
  margin_type: z.union([z.literal(0), z.literal(1)]).nullable().optional(),
  timezone: z.string().max(100).nullable().optional(),
  show_products_details_in_sales_table: z.boolean().nullable().optional(),
  show_products_details_in_purchase_table: z.boolean().nullable().optional(),
})

export type GeneralSettingFormData = z.infer<typeof generalSettingSchema>
