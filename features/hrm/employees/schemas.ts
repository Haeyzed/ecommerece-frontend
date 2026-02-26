import { z } from "zod";
import { CSV_MIME_TYPES, MAX_FILE_SIZE } from '@/lib/utils/mimes';

export const employeeSalesTargetSchema = z.object({
  sales_from: z.number().min(0),
  sales_to: z.number().min(0),
  percent: z.number().min(0).max(100),
});

export const employeeUserSchema = z.object({
  username: z.string().min(1).max(255),
  password: z.string().min(8).optional().or(z.literal('')),
  roles: z.array(z.number()).optional(),
  permissions: z.array(z.number()).optional(),
});

export const employeeSchema = z.object({
  name: z.string().min(1).max(255),
  staff_id: z.string().min(1).max(100),
  email: z.string().email().max(255).optional().or(z.literal('')),
  phone_number: z.string().max(255).optional().or(z.literal('')),
  address: z.string().max(255).nullable().optional(),
  department_id: z.number(),
  designation_id: z.number(),
  shift_id: z.number(),
  basic_salary: z.number().min(0),
  country_id: z.number().nullable().optional(),
  state_id: z.number().nullable().optional(),
  city_id: z.number().nullable().optional(),
  is_active: z.boolean().nullable().optional(),
  is_sale_agent: z.boolean().nullable().optional(),
  sale_commission_percent: z.number().min(0).nullable().optional(),
  sales_target: z.array(employeeSalesTargetSchema).optional(),
  user_id: z.number().nullable().optional(),
  user: employeeUserSchema.nullable().optional(),
  image: z
    .custom<File>()
    .array()
    .max(1)
    .optional(),
}).refine((data) => {
  if (data.sales_target && data.sales_target.length > 0) {
    let previousTo: number | null = null;
    for (const target of data.sales_target) {
      if (previousTo !== null && target.sales_from <= previousTo) {
        return false;
      }
      previousTo = target.sales_to;
    }
  }
  return true;
}, {
  path: ["sales_target"]
});

export const employeeImportSchema = z.object({
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

export const employeeExportSchema = z
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

export type EmployeeFormData = z.infer<typeof employeeSchema>;
export type EmployeeImportFormData = z.infer<typeof employeeImportSchema>;
export type EmployeeExportFormData = z.infer<typeof employeeExportSchema>;