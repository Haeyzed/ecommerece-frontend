/**
 * Categories Schemas
 *
 * Validation schemas and type inference for category forms.
 * Uses Zod for client-side validation that mirrors server-side rules.
 *
 * @module features/products/categories/schemas
 */

import { z } from "zod";

/**
 * categorySchema
 *
 * Zod validation schema for creating and updating categories.
 */
export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(255, "Name is too long"),
  slug: z.string().max(255, "Slug is too long").nullable().optional(),
  short_description: z
    .string()
    .max(1000, "Description is too long")
    .nullable()
    .optional(),
  page_title: z.string().max(255, "Page title is too long").nullable().optional(),
  image: z.array(z.custom<File>()).max(1, 'Please select only one image').optional(),
  icon: z.array(z.custom<File>()).max(1, 'Please select only one icon').optional(),
  parent_id: z.number().int().nullable().optional(),
  is_active: z.boolean().nullable().optional(),
  featured: z.boolean().nullable().optional(),
  is_sync_disable: z.boolean().nullable().optional(),
  woocommerce_category_id: z.number().int().nullable().optional(),
});

/**
 * categoryImportSchema
 * * Validation for the file import form.
 */
export const categoryImportSchema = z.object({
  file: z
    .array(z.custom<File>())
    .min(1, "Please select a file to import")
    .max(1, "Please select only one file")
    .refine((files) => files.length > 0, "File is required"),
})


/**
 * CategoryFormData
 *
 * Type definition inferred from the Zod schema.
 * Used for type-safe form handling.
 */
export type CategoryFormData = z.infer<typeof categorySchema>;
export type CategoryImportFormData = z.infer<typeof categoryImportSchema>;