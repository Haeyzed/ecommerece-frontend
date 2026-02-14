import { z } from "zod";

export const brandSchema = z.object({
  name: z.string().min(1, "Brand name is required").max(255, "Name is too long"),
  slug: z.string().max(255, "Slug is too long").nullable().optional(),
  short_description: z
    .string()
    .max(1000, "Description is too long")
    .nullable()
    .optional(),
  page_title: z.string().max(255, "Page title is too long").nullable().optional(),
  image: z
    .array(z.custom<File>())
    .max(1, 'Please select only one image')
    .optional(),
  is_active: z.boolean().nullable().optional(),
});

export const brandImportSchema = z.object({
  file: z
    .array(z.custom<File>())
    .min(1, "Please select a file to import")
    .max(1, "Please select only one file")
    .refine((files) => {
      // basic check for csv/excel mime types or extensions could go here
      return files.length > 0;
    }, "File is required"),
})

export const brandExportSchema = z
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

export type BrandFormData = z.infer<typeof brandSchema>;
export type BrandImportFormData = z.infer<typeof brandImportSchema>;
export type BrandExportFormData = z.infer<typeof brandExportSchema>;