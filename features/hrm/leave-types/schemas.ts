import { z } from "zod";
import { CSV_MIME_TYPES, MAX_FILE_SIZE } from '@/lib/utils/mimes';

export const leaveTypeSchema = z.object({
  name: z.string().min(1, "Leave type name is required").max(255, "Name is too long"),
  annual_quota: z.number().min(0, "Annual quota must be 0 or more"),
  encashable: z.boolean(),
  carry_forward_limit: z.number().min(0, "Carry forward limit must be 0 or more"),
  is_active: z.boolean().nullable().optional(),
});

export const leaveTypeImportSchema = z.object({
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

export const leaveTypeExportSchema = z
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

export type LeaveTypeFormData = z.infer<typeof leaveTypeSchema>;
export type LeaveTypeImportFormData = z.infer<typeof leaveTypeImportSchema>;
export type LeaveTypeExportFormData = z.infer<typeof leaveTypeExportSchema>;