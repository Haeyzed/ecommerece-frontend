"use client";

/**
 * Product Form Component
 * Reusable form for create/edit using React Hook Form + Zod
 */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductFormData } from "../schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError, FieldContent } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import type { Product } from "../types";
import { ValidationError } from "@/lib/api/api-errors";

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function ProductForm({
  product,
  onSubmit,
  onCancel,
  isLoading = false,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
        }
      : undefined,
  });

  const handleFormSubmit = async (data: ProductFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      if (error instanceof ValidationError && error.errors) {
        // Map API validation errors to form fields
        Object.entries(error.errors).forEach(([field, messages]) => {
          setError(field as keyof ProductFormData, {
            type: "server",
            message: messages[0],
          });
        });
      } else {
        setError("root", {
          type: "server",
          message: error instanceof Error ? error.message : "An error occurred",
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Field>
        <FieldLabel>
          Name <span className="text-destructive">*</span>
        </FieldLabel>
        <FieldContent>
          <Input
            {...register("name")}
            disabled={isSubmitting || isLoading}
            placeholder="Product name"
          />
          <FieldError>{errors.name?.message}</FieldError>
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>
          Description <span className="text-destructive">*</span>
        </FieldLabel>
        <FieldContent>
          <Textarea
            {...register("description")}
            disabled={isSubmitting || isLoading}
            placeholder="Product description"
            rows={4}
          />
          <FieldError>{errors.description?.message}</FieldError>
        </FieldContent>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel>
            Price <span className="text-destructive">*</span>
          </FieldLabel>
          <FieldContent>
            <Input
              type="number"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
              disabled={isSubmitting || isLoading}
              placeholder="0.00"
            />
            <FieldError>{errors.price?.message}</FieldError>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>
            Stock <span className="text-destructive">*</span>
          </FieldLabel>
          <FieldContent>
            <Input
              type="number"
              {...register("stock", { valueAsNumber: true })}
              disabled={isSubmitting || isLoading}
              placeholder="0"
            />
            <FieldError>{errors.stock?.message}</FieldError>
          </FieldContent>
        </Field>
      </div>

      {errors.root && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {errors.root.message}
        </div>
      )}

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting || isLoading}>
          {isSubmitting ? "Saving..." : product ? "Update" : "Create"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
