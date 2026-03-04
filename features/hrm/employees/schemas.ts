import { z } from 'zod'
import { CSV_MIME_TYPES, MAX_FILE_SIZE } from '@/lib/utils/mimes'

export const employeeSalesTargetSchema = z.object({
  sales_from: z.number().min(0),
  sales_to: z.number().min(0),
  percent: z.number().min(0).max(100),
})

export const employeeUserSchema = z.object({
  username: z.string().min(1).max(255),
  password: z.string().min(8).optional().or(z.literal('')),
  roles: z.array(z.number()).nullable().optional(),
  permissions: z.array(z.number()).nullable().optional(),
})

export const employeeProfileSchema = z.object({
  date_of_birth: z.string().nullable().optional(),
  gender: z.string().max(20).nullable().optional(),
  marital_status: z.string().max(20).nullable().optional(),
  national_id: z.string().max(255).nullable().optional(),
  tax_number: z.string().max(255).nullable().optional(),
  bank_name: z.string().max(255).nullable().optional(),
  account_number: z.string().max(255).nullable().optional(),
})

export const employeeDocumentSchema = z.object({
  id: z.number().optional(), // For updates
  document_type_id: z.number().min(1, 'Document Type is required'),
  name: z.string().max(255).nullable().optional(),
  notes: z.string().nullable().optional(),
  issue_date: z.string().nullable().optional(),
  expiry_date: z.string().nullable().optional(),
  file: z.any().optional(), // Array of files from FileUpload component
})

export const employeeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  staff_id: z.string().min(1, 'Staff ID is required').max(100),
  email: z.string().email().max(255).optional().or(z.literal('')),
  phone_number: z.string().max(255).optional().or(z.literal('')),
  address: z.string().max(255).nullable().optional(),
  department_id: z.number().min(1, 'Department is required'),
  designation_id: z.number().min(1, 'Designation is required'),
  shift_id: z.number().min(1, 'Shift is required'),
  basic_salary: z.number().min(0),
  country_id: z.number().nullable().optional(),
  state_id: z.number().nullable().optional(),
  city_id: z.number().nullable().optional(),
  image: z.any().optional(),
  is_active: z.boolean().optional(),
  is_sale_agent: z.boolean().optional(),
  sale_commission_percent: z.number().nullable().optional(),

  onboarding_checklist_template_id: z.number().nullable().optional(),

  user: employeeUserSchema.optional(),
  profile: employeeProfileSchema.optional(),
  sales_target: z.array(employeeSalesTargetSchema).optional(),
  documents: z.array(employeeDocumentSchema).optional(),
}).refine((data) => {
  if (data.sales_target && data.sales_target.length > 0) {
    let previousTo: number | null = null
    for (const target of data.sales_target) {
      if (previousTo !== null && target.sales_from <= previousTo) {
        return false
      }
      previousTo = target.sales_to
    }
  }
  return true
}, {
  message: 'Each sales target\'s \'From\' value must be greater than the previous tier\'s \'To\' value.',
  path: ['sales_target'],
})

export const employeeImportSchema = z.object({
  file: z
    .array(z.custom<File>())
    .min(1)
    .max(1)
    .refine((files) => {
      return files?.[0]?.size <= MAX_FILE_SIZE
    })
    .refine((files) => {
      const file = files?.[0]
      if (!file) return false
      const isValidMime = CSV_MIME_TYPES.includes(file.type)
      const isValidExtension = file.name.toLowerCase().endsWith('.csv')
      return isValidMime || isValidExtension
    }),
})

export const employeeExportSchema = z
  .object({
    format: z.enum(['excel', 'pdf']),
    method: z.enum(['download', 'email']),
    columns: z.array(z.string()).min(1),
    user_id: z.number().optional(),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.method === 'email') {
        return data.user_id !== undefined
      }
      return true
    },
    { path: ['user_id'] },
  )

export type EmployeeFormData = z.infer<typeof employeeSchema>;
export type EmployeeImportFormData = z.infer<typeof employeeImportSchema>;
export type EmployeeExportFormData = z.infer<typeof employeeExportSchema>;