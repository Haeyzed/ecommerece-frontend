import { z } from 'zod'
import { CSV_MIME_TYPES, MAX_FILE_SIZE } from '@/lib/utils/mimes'

export const customerGroupSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  percentage: z.coerce.number().min(0, 'Must be 0 or more').max(100, 'Must be 100 or less').nullable().optional(),
  is_active: z.boolean().nullable().optional(),
})

export type CustomerGroupFormData = z.infer<typeof customerGroupSchema>

export const customerGroupImportSchema = z.object({
  file: z
    .array(z.custom<File>())
    .min(1, "Please select a file to import")
    .max(1, "Please select only one file")
    .refine((files) => {
      return files?.[0]?.size <= MAX_FILE_SIZE;
    }, `Max file size is 5MB.`)
    .refine((files) => {
      const file = files?.[0];
      if (!file) return false;
      const isValidMime = CSV_MIME_TYPES.includes(file.type);
      const isValidExtension = file.name.toLowerCase().endsWith(".csv");

      return isValidMime || isValidExtension;
    }, "Only .csv files are allowed"),
})

export type CustomerGroupImportFormData = z.infer<typeof customerGroupImportSchema>

export const customerGroupExportSchema = z
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

export type CustomerGroupExportFormData = z.infer<typeof customerGroupExportSchema>
