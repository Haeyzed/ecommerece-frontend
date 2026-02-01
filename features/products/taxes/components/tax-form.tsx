"use client";

/**
 * Tax Form Component (Controller)
 */

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taxSchema, type TaxFormData } from "../schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
  FieldContent,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import type { Tax } from "../types";
import { ValidationError } from "@/lib/api/api-errors";

interface TaxFormProps {
  tax?: Tax;
  onSubmit: (data: TaxFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function TaxForm({
  tax,
  onSubmit,
  onCancel,
  isLoading = false,
}: TaxFormProps) {
  const form = useForm<TaxFormData>({
    resolver: zodResolver(taxSchema),
    defaultValues: tax
      ? {
          name: tax.name,
          rate: tax.rate,
          is_active: tax.is_active,
          woocommerce_tax_id: tax.woocommerce_tax_id ?? null,
        }
      : {
          name: "",
          rate: 0,
          is_active: true,
          woocommerce_tax_id: null,
        },
  });

  const handleFormSubmit = async (data: TaxFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      if (error instanceof ValidationError && error.errors) {
        Object.entries(error.errors).forEach(([field, messages]) => {
          form.setError(field as keyof TaxFormData, {
            type: "server",
            message: messages[0],
          });
        });
      } else {
        form.setError("root", {
          type: "server",
          message: error instanceof Error ? error.message : "An error occurred",
        });
      }
    }
  };

  return (
    <form
      id="form-tax"
      onSubmit={form.handleSubmit(handleFormSubmit)}
      className="space-y-6"
    >
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>
                Name <span className="text-destructive">*</span>
              </FieldLabel>
              <FieldContent>
                <Input
                  {...field}
                  disabled={form.formState.isSubmitting || isLoading}
                  placeholder="e.g. VAT"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
            </Field>
          )}
        />
        <Controller
          name="rate"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>
                Rate (%) <span className="text-destructive">*</span>
              </FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  step="0.01"
                  min={0}
                  max={100}
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value)
                    )
                  }
                  onBlur={field.onBlur}
                  disabled={form.formState.isSubmitting || isLoading}
                  placeholder="e.g. 15.5"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
            </Field>
          )}
        />
        <Controller
          name="woocommerce_tax_id"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>WooCommerce Tax ID</FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === ""
                        ? null
                        : Number(e.target.value)
                    )
                  }
                  onBlur={field.onBlur}
                  disabled={form.formState.isSubmitting || isLoading}
                  placeholder="Optional"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
            </Field>
          )}
        />
        <Controller
          name="is_active"
          control={form.control}
          render={({ field }) => (
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel>Is Active</FieldLabel>
                <Switch
                  checked={field.value ?? false}
                  onCheckedChange={field.onChange}
                  disabled={form.formState.isSubmitting || isLoading}
                />
              </div>
            </Field>
          )}
        />
      </FieldGroup>

      {form.formState.errors.root && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {form.formState.errors.root.message}
        </div>
      )}

      <div className="flex gap-4">
        <Button
          type="submit"
          form="form-tax"
          disabled={form.formState.isSubmitting || isLoading}
        >
          {form.formState.isSubmitting ? "Saving..." : tax ? "Update" : "Create"}
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
