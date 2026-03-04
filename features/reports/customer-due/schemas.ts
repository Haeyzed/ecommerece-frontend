import { z } from 'zod'

export const customerDueReportExportSchema = z
  .object({
    start_date: z.string().min(1, 'Start date is required'),
    end_date: z.string().min(1, 'End date is required'),
    customer_id: z.number().nullable().optional(),
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

export type CustomerDueReportExportFormData = z.infer<
  typeof customerDueReportExportSchema
>
