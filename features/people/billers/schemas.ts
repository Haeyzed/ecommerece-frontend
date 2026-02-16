import { z } from "zod";
import { CSV_MIME_TYPES, MAX_FILE_SIZE } from '@/lib/utils/mimes'

export const billerSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  company_name: z.string().min(1, "Company name is required").max(255, "Company name is too long"),
  vat_number: z.string().max(255).nullable().optional(),
  email: z.string().min(1, "Email is required").email("Invalid email").max(255),
  phone_number: z.string().min(1, "Phone number is required").max(255),
  address: z.string().min(1, "Address is required").max(500),
  country_id: z.number().nullable().optional(),
  state_id: z.number().nullable().optional(),
  city_id: z.number().nullable().optional(),
  postal_code: z.string().max(50).nullable().optional(),
  image: z
    .array(z.custom<File>())
    .max(1, "Please select only one image")
    .optional(),
  is_active: z.boolean().nullable().optional(),
});

export const billerImportSchema = z.object({
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

export const billerExportSchema = z
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

export type BillerFormData = z.infer<typeof billerSchema>;
export type BillerImportFormData = z.infer<typeof billerImportSchema>;
export type BillerExportFormData = z.infer<typeof billerExportSchema>;