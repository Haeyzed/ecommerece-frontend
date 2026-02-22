import { z } from "zod";
import { CSV_MIME_TYPES, MAX_FILE_SIZE } from '@/lib/utils/mimes';

export const currencySchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  code: z.string().min(1, "Code is required").max(255, "Code is too long"),
  symbol: z.string().min(1, "Symbol is required").max(255, "Symbol is too long"),
  country_id: z.number().min(1, "Country selection is required"),
  precision: z.number().nullable().optional(),
  symbol_native: z.string().max(255).optional().nullable(),
  symbol_first: z.boolean().nullable().optional(),
  decimal_mark: z.string().max(255).optional().nullable(),
  thousands_separator: z.string().max(255).optional().nullable(),
});

export const currencyImportSchema = z.object({
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

export const currencyExportSchema = z
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

export type CurrencyFormData = z.infer<typeof currencySchema>;
export type CurrencyImportFormData = z.infer<typeof currencyImportSchema>;
export type CurrencyExportFormData = z.infer<typeof currencyExportSchema>;