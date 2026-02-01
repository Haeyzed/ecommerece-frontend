/**
 * Brands Schemas
 *
 * Validation schemas and type inference for brand forms.
 * Uses Zod for client-side validation that mirrors server-side rules.
 *
 * @module features/brands/schemas
 */

import { z } from "zod";

/**
 * brandSchema
 *
 * Zod validation schema for creating and updating brands.
 *
 * Validation rules:
 * - `name`: Required, max 255 chars
 * - `slug`: Optional, max 255 chars
 * - `short_description`: Optional, max 1000 chars
 * - `page_title`: Optional, max 255 chars
 * - `image`: Optional file arrays (max 1 file)
 * - `is_active`: Optional boolean
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
  image: z.array(z.custom<File>()).max(1, 'Please select only one image').optional(),
  is_active: z.boolean().nullable().optional(),
});

/**
 * BrandFormData
 *
 * Type definition inferred from the Zod schema.
 * Used for type-safe form handling.
 */
export type BrandFormData = z.infer<typeof brandSchema>;