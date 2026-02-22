import { z } from "zod";
import { CSV_MIME_TYPES, MAX_FILE_SIZE } from '@/lib/utils/mimes';

export const stateSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  country_id: z.number().min(1, "Country selection is required"),
  code: z.string().max(255).optional().nullable(),
  country_code: z.string().max(2).optional().nullable(),
  state_code: z.string().max(255).optional().nullable(),
  type: z.string().max(255).optional().nullable(),
  latitude: z.string().max(255).optional().nullable(),
  longitude: z.string().max(255).optional().nullable(),
});

export const stateImportSchema = z.object({
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

export const stateExportSchema = z
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

export type StateFormData = z.infer<typeof stateSchema>;
export type StateImportFormData = z.infer<typeof stateImportSchema>;
export type StateExportFormData = z.infer<typeof stateExportSchema>;