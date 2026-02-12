/**
 * Supplier schemas
 *
 * Zod validation for supplier forms. Mirrors backend SupplierRequest where possible.
 */

import { z } from 'zod'

export interface Supplier {
  id: number
  name: string
  company_name: string | null
  vat_number: string | null
  email: string | null
  phone_number: string | null
  wa_number: string | null
  address: string | null
  city: string | null
  state: string | null
  postal_code: string | null
  country: string | null
  opening_balance: number
  pay_term_no: number | null
  pay_term_period: string | null
  image: string | null
  image_url: string | null
  is_active: boolean
  created_at: string | null
  updated_at: string | null
}

export type SupplierStatus = 'active' | 'inactive'

const optionalString = z.string().max(255).nullable().optional()

export const supplierSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  company_name: optionalString,
  vat_number: optionalString,
  email: z.string().email('Invalid email').max(255).optional().or(z.literal('')),
  phone_number: optionalString,
  wa_number: optionalString,
  address: optionalString,
  city: optionalString,
  state: optionalString,
  postal_code: z.string().max(50).nullable().optional(),
  country: optionalString,
  opening_balance: z.coerce.number().nullable().optional(),
  pay_term_no: z.coerce.number().int().min(0).nullable().optional(),
  pay_term_period: z.string().max(50).nullable().optional(),
  image: z.array(z.custom<File>()).nullable().optional(),
  is_active: z.boolean().nullable().optional(),
})

export type SupplierFormData = z.infer<typeof supplierSchema>

export const supplierImportSchema = z.object({
  file: z
    .array(z.custom<File>())
    .min(1, 'Please select a file to import')
    .max(1, 'Please select only one file'),
})

export type SupplierImportFormData = z.infer<typeof supplierImportSchema>

export const supplierExportSchema = z
  .object({
    format: z.enum(['excel', 'pdf']),
    method: z.enum(['download', 'email']),
    columns: z.array(z.string()).min(1, 'Please select at least one column'),
    user_id: z.number().optional(),
  })
  .refine(
    (data) => {
      if (data.method === 'email') return data.user_id !== undefined
      return true
    },
    { message: 'Please select a user to send the email to', path: ['user_id'] }
  )

export type SupplierExportFormData = z.infer<typeof supplierExportSchema>
