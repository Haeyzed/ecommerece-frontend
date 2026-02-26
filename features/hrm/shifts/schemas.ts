import { z } from "zod";
import { CSV_MIME_TYPES, MAX_FILE_SIZE } from '@/lib/utils/mimes';

// Regex to strictly enforce HH:MM format
const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

export const shiftSchema = z.object({
  name: z.string().min(1, "Shift name is required").max(255, "Name is too long"),
  start_time: z.string().regex(timeRegex, "Start time must be in HH:MM format"),
  end_time: z.string().regex(timeRegex, "End time must be in HH:MM format"),
  grace_in: z.number().min(0, "Grace in must be 0 or more"),
  grace_out: z.number().min(0, "Grace out must be 0 or more"),
  total_hours: z.number().min(0, "Total hours must be 0 or more"),
  is_active: z.boolean().nullable().optional(),
});

export const shiftImportSchema = z.object({
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
});

export const shiftExportSchema = z
  .object({
    format: z.enum(["excel", "pdf"]),
    method: z.enum(["download", "email"]),
    columns: z.array(z.string()).min(1, "Please select at least one column"),
    user_id: z.number().optional(),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.method === "email") {
        return data.user_id !== undefined;
      }
      return true;
    },
    { message: "Please select a user to send the email to", path: ["user_id"] }
  );

export type ShiftFormData = z.infer<typeof shiftSchema>;
export type ShiftImportFormData = z.infer<typeof shiftImportSchema>;
export type ShiftExportFormData = z.infer<typeof shiftExportSchema>;