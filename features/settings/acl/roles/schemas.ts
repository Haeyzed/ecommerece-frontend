import { z } from "zod";
import { CSV_MIME_TYPES, MAX_FILE_SIZE } from '@/lib/utils/mimes';

export const roleSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(500).nullable().optional(),
  guard_name: z.string().max(255).nullable().optional(),
  is_active: z.boolean().nullable().optional(),
  permissions: z.array(z.number()).nullable().optional(),
});

export const roleImportSchema = z.object({
  file: z
    .array(z.custom<File>())
    .min(1)
    .max(1)
    .refine((files) => {
      return files?.[0]?.size <= MAX_FILE_SIZE;
    })
    .refine((files) => {
      const file = files?.[0];
      if (!file) return false;
      const isValidMime = CSV_MIME_TYPES.includes(file.type);
      const isValidExtension = file.name.toLowerCase().endsWith(".csv");
      return isValidMime || isValidExtension;
    }),
});

export const roleExportSchema = z
  .object({
    format: z.enum(["excel", "pdf"]),
    method: z.enum(["download", "email"]),
    columns: z.array(z.string()).min(1),
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
    { path: ["user_id"] }
  );

export type RoleFormData = z.infer<typeof roleSchema>;
export type RoleImportFormData = z.infer<typeof roleImportSchema>;
export type RoleExportFormData = z.infer<typeof roleExportSchema>;