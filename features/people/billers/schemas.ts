/**
 * Biller schemas
 *
 * Zod validation for biller forms. Mirrors backend BillerRequest where possible.
 */

import { z } from 'zod'

export interface Biller {
  id: number
  name: string
  company_name: string
  vat_number: string | null
  email: string
  phone_number: string
  address: string
  city: string
  state: string | null
  postal_code: string | null
  country: string | null
  image: string | null
  image_url: string | null
  is_active: boolean
  created_at: string | null
  updated_at: string | null
}

export type BillerStatus = 'active' | 'inactive'

const optionalString = z.string().max(255).nullable().optional()

export const billerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  company_name: z.string().min(1, 'Company name is required').max(255, 'Company name is too long'),
  vat_number: optionalString,
  email: z.string().min(1, 'Email is required').email('Invalid email').max(255),
  phone_number: z.string().min(1, 'Phone number is required').max(255),
  address: z.string().min(1, 'Address is required').max(500),
  city: z.string().min(1, 'City is required').max(255),
  state: optionalString,
  postal_code: z.string().max(50).nullable().optional(),
  country: optionalString,
  image: z.array(z.custom<File>()).nullable().optional(),
  is_active: z.boolean().nullable().optional(),
})

export type BillerFormData = z.infer<typeof billerSchema>

export const billerImportSchema = z.object({
  file: z
    .array(z.custom<File>())
    .min(1, 'Please select a file to import')
    .max(1, 'Please select only one file'),
})

export type BillerImportFormData = z.infer<typeof billerImportSchema>

export const billerExportSchema = z
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

export type BillerExportFormData = z.infer<typeof billerExportSchema>
