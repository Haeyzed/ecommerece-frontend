import { z } from 'zod'

export const payrollRunSchema = z.object({
  month: z.string().min(1, 'Month is required').regex(/^\d{4}-\d{2}$/, 'Use YYYY-MM format'),
  year: z.number().min(2000).max(2100),
})

export type PayrollRunFormData = z.infer<typeof payrollRunSchema>
