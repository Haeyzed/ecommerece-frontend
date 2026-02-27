import { z } from "zod";
import { CSV_MIME_TYPES, MAX_FILE_SIZE } from '@/lib/utils/mimes';

export const attendanceSchema = z.object({
  employee_ids: z.array(z.number()).min(1, "At least one employee is required"),
  date: z.string().min(1, "Date is required"),
  checkin: z.string().min(1, "Check-in time is required"),
  checkout: z.string().nullable().optional(),
  note: z.string().max(500, "Note is too long").nullable().optional(),
});

export const attendanceImportSchema = z.object({
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

export const attendanceExportSchema = z
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
    {
      message: "User is required when sending an email",
      path: ["user_id"],
    }
  );

export type AttendanceFormData = z.infer<typeof attendanceSchema>;
export type AttendanceImportFormData = z.infer<typeof attendanceImportSchema>;
export type AttendanceExportFormData = z.infer<typeof attendanceExportSchema>;