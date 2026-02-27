import { z } from "zod";
import { CSV_MIME_TYPES, MAX_FILE_SIZE } from '@/lib/utils/mimes';

export const overtimeSchema = z.object({
  employee_id: z.number().min(1, "Employee is required"),
  date: z.string().min(1, "Date is required"),
  hours: z.number().min(0, "Hours must be 0 or more"),
  rate: z.number().min(0, "Rate must be 0 or more"),
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
});

export const overtimeImportSchema = z.object({
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

export const overtimeExportSchema = z
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

export type OvertimeFormData = z.infer<typeof overtimeSchema>;
export type OvertimeImportFormData = z.infer<typeof overtimeImportSchema>;
export type OvertimeExportFormData = z.infer<typeof overtimeExportSchema>;