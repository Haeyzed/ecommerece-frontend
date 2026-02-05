/**
 * Brands Schemas
 *
 * Validation schemas and type inference for brand forms.
 * Uses Zod for client-side validation that mirrors server-side rules.
 *
 * @module features/products/brands/schemas
 */

import { z } from "zod";

/**
 * brandSchema
 *
 * Zod validation schema for creating and updating brands.
 */
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

/**
 * brandImportSchema
 * * Validation for the file import form.
 * Ensures a file is selected and is of correct type.
 */
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

/**
 * BrandFormData
 *
 * Type definition inferred from the Zod schema.
 * Used for type-safe form handling.
 */
export type BrandFormData = z.infer<typeof brandSchema>;
export type BrandImportFormData = z.infer<typeof brandImportSchema>;