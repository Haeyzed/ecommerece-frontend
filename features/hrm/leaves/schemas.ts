import { z } from "zod";
import { CSV_MIME_TYPES, MAX_FILE_SIZE } from '@/lib/utils/mimes';

export const leaveSchema = z.object({
  employee_id: z.number().min(1, "Employee is required"),
  leave_type_id: z.number().min(1, "Leave type is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
}).refine((data) => new Date(data.end_date) >= new Date(data.start_date), {
  message: "End date must be after or equal to start date",
  path: ["end_date"],
});

export const leaveImportSchema = z.object({
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

export const leaveExportSchema = z
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

export type LeaveFormData = z.infer<typeof leaveSchema>;
export type LeaveImportFormData = z.infer<typeof leaveImportSchema>;
export type LeaveExportFormData = z.infer<typeof leaveExportSchema>;