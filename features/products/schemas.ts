/**
 * Products Zod Schemas
 */

import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be positive"),
  stock: z.number().int().min(0, "Stock must be a non-negative integer"),
});

export type ProductFormData = z.infer<typeof productSchema>;
