/**
 * Customer schemas
 *
 * Zod validation for customer forms. Mirrors backend CustomerRequest where possible.
 * Unique checks (email, phone, username) are enforced on the server.
 */

import { z } from 'zod'

const optionalString = z.string().max(255).nullable().optional()
const optionalStringLong = z.string().max(500).nullable().optional()

export const customerSchema = z
  .object({
    customer_group_id: z.number().int().positive('Customer group is required'),
    name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
    company_name: optionalString,
    email: z.string().email('Invalid email').max(255).nullable().optional().or(z.literal('')),
    type: z.string().max(50).nullable().optional(),
    phone_number: optionalString,
    wa_number: optionalString,
    tax_no: optionalString,
    address: optionalStringLong,
    city: optionalString,
    state: optionalString,
    postal_code: z.string().max(50).nullable().optional(),
    country: optionalString,
    opening_balance: z.coerce.number().min(0).nullable().optional(),
    credit_limit: z.coerce.number().min(0).nullable().optional(),
    deposit: z.coerce.number().min(0).nullable().optional(),
    pay_term_no: z.coerce.number().int().min(0).nullable().optional(),
    pay_term_period: z.string().max(50).nullable().optional(),
    is_active: z.boolean().nullable().optional(),
    both: z.boolean().optional(),
    user: z.boolean().optional(),
    username: z.string().max(255).nullable().optional(),
    password: z.string().min(8, 'Password must be at least 8 characters').max(255).nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.both) {
      if (!data.company_name?.trim()) {
        ctx.addIssue({ code: 'custom', message: 'Company name is required when also adding as supplier', path: ['company_name'] })
      }
      if (!data.email?.trim()) {
        ctx.addIssue({ code: 'custom', message: 'Email is required when also adding as supplier', path: ['email'] })
      }
      if (!data.address?.trim()) {
        ctx.addIssue({ code: 'custom', message: 'Address is required when also adding as supplier', path: ['address'] })
      }
      if (!data.city?.trim()) {
        ctx.addIssue({ code: 'custom', message: 'City is required when also adding as supplier', path: ['city'] })
      }
    }
    if (data.user) {
      if (!data.username?.trim()) {
        ctx.addIssue({ code: 'custom', message: 'Username is required when creating login', path: ['username'] })
      }
      if (!data.both && !data.email?.trim()) {
        ctx.addIssue({ code: 'custom', message: 'Email is required when creating login', path: ['email'] })
      }
    }
  })

export type CustomerFormData = z.infer<typeof customerSchema>

export const customerImportSchema = z.object({
  file: z
    .array(z.custom<File>())
    .min(1, 'Please select a file to import')
    .max(1, 'Please select only one file'),
})

export const customerExportSchema = z
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

export type CustomerImportFormData = z.infer<typeof customerImportSchema>
export type CustomerExportFormData = z.infer<typeof customerExportSchema>
