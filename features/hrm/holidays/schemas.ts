import { z } from 'zod';
import { CSV_MIME_TYPES, MAX_FILE_SIZE } from '@/lib/utils/mimes';

export const holidaySchema = z
  .object({
    user_id: z.number().nullable().optional(),
    from_date: z.string().min(1, 'From date is required'),
    to_date: z.string().min(1, 'To date is required'),
    note: z.string().max(500).nullable().optional(),
    is_approved: z.boolean().nullable().optional(),
    recurring: z.boolean().nullable().optional(),
    region: z.string().max(255).nullable().optional(),
  })
  .refine((data) => !data.from_date || !data.to_date || data.to_date >= data.from_date, {
    message: 'To date must be on or after from date',
    path: ['to_date'],
  });

export const holidayImportSchema = z.object({
  file: z
    .array(z.custom<File>())
    .min(1, 'Please select a file to import')
    .max(1, 'Please select only one file')
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, 'Max file size is 5MB.')
    .refine((files) => {
      const file = files?.[0];
      if (!file) return false;
      const isValidMime = CSV_MIME_TYPES.includes(file.type);
      const isValidExtension = file.name.toLowerCase().endsWith('.csv');
      return isValidMime || isValidExtension;
    }, 'Only .csv files are allowed'),
});

export const holidayExportSchema = z
  .object({
    format: z.enum(['excel', 'pdf']),
    method: z.enum(['download', 'email']),
    columns: z.array(z.string()).min(1, 'Please select at least one column'),
    user_id: z.number().optional(),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.method === 'email') return data.user_id !== undefined;
      return true;
    },
    { message: 'Please select a user to send the email to', path: ['user_id'] }
  );

export type HolidayFormData = z.infer<typeof holidaySchema>;
export type HolidayImportFormData = z.infer<typeof holidayImportSchema>;
export type HolidayExportFormData = z.infer<typeof holidayExportSchema>;
