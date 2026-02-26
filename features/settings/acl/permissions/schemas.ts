import { z } from "zod";
import { CSV_MIME_TYPES, MAX_FILE_SIZE } from '@/lib/utils/mimes';

export const permissionSchema = z.object({
  name: z.string().min(1).max(255),
  guard_name: z.string().max(255).nullable().optional(),
  module: z.string().max(255).nullable().optional(),
  description: z.string().max(500).nullable().optional(),
  is_active: z.boolean().nullable().optional(),
});

export const permissionImportSchema = z.object({
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

export const permissionExportSchema = z
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

export type PermissionFormData = z.infer<typeof permissionSchema>;
export type PermissionImportFormData = z.infer<typeof permissionImportSchema>;
export type PermissionExportFormData = z.infer<typeof permissionExportSchema>;