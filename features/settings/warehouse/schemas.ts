/**
 * Warehouse Schemas
 *
 * Validation schemas and type inference for warehouse forms.
 *
 * @module features/settings/warehouse/schemas
 */

import { z } from "zod";

export const warehouseSchema = z.object({
  name: z.string().min(1, "Warehouse name is required").max(255, "Name is too long"),
  phone: z.string().max(255).optional().nullable(),
  email: z.union([z.string().email("Invalid email").max(255), z.literal("")]).optional(),
  address: z.string().max(255).optional().nullable(),
  is_active: z.boolean().nullable().optional(),
});

export const warehouseImportSchema = z.object({
  file: z
    .array(z.custom<File>())
    .min(1, "Please select a file to import")
    .max(1, "Please select only one file")
    .refine((files) => files.length > 0, "File is required"),
});

export const warehouseExportSchema = z
  .object({
    format: z.enum(["excel", "pdf"]),
    method: z.enum(["download", "email"]),
    columns: z.array(z.string()).min(1, "Please select at least one column"),
    user_id: z.number().optional(),
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

export type WarehouseFormData = z.infer<typeof warehouseSchema>;
export type WarehouseImportFormData = z.infer<typeof warehouseImportSchema>;
export type WarehouseExportFormData = z.infer<typeof warehouseExportSchema>;
