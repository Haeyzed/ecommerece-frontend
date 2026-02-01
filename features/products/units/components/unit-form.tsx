"use client";

/**
 * Unit Form Component
 * Supports base unit selection and conversion (operator + operation_value)
 */

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { unitSchema, type UnitFormData } from "../schemas";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Unit } from "../types";
import { ValidationError } from "@/lib/api/api-errors";
import { useBaseUnits } from "../api";

interface UnitFormProps {
  unit?: Unit;
  onSubmit: (data: UnitFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

const OPERATOR_OPTIONS = [
  { value: "none", label: "— None —" },
  { value: "*", label: "Multiply (*)" },
  { value: "/", label: "Divide (/)" },
  { value: "+", label: "Add (+)" },
  { value: "-", label: "Subtract (-)" },
] as const;

export function UnitForm({
  unit,
  onSubmit,
  onCancel,
  isLoading = false,
}: UnitFormProps) {
  const { data: baseUnitsData } = useBaseUnits();
  const baseUnits = (baseUnitsData?.data ?? []) as Unit[];

  const form = useForm<UnitFormData>({
    resolver: zodResolver(unitSchema),
    defaultValues: unit
      ? {
          code: unit.code,
          name: unit.name,
          base_unit: unit.base_unit ?? null,
          operator: unit.operator ?? null,
          operation_value: unit.operation_value ?? null,
          is_active: unit.is_active,
        }
      : {
          code: "",
          name: "",
          base_unit: null,
          operator: null,
          operation_value: null,
          is_active: true,
        },
  });

  const baseUnit = form.watch("base_unit");

  const handleFormSubmit = async (data: UnitFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      if (error instanceof ValidationError && error.errors) {
        Object.entries(error.errors).forEach(([fieldName, messages]) => {
          form.setError(fieldName as keyof UnitFormData, {
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

  const baseUnitItems = [
    { value: "none", label: "— None (base unit) —" },
    ...baseUnits
      .filter((u) => !unit || u.id !== unit.id)
      .map((u) => ({ value: String(u.id), label: `${u.code} – ${u.name}` })),
  ];

  return (
    <form
      id="form-unit"
      onSubmit={form.handleSubmit(handleFormSubmit)}
      className="space-y-6"
    >
      <FieldGroup>
        <Controller
          name="code"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>
                Code <span className="text-destructive">*</span>
              </FieldLabel>
              <FieldContent>
                <Input
                  {...field}
                  disabled={form.formState.isSubmitting || isLoading}
                  placeholder="e.g. KG"
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
                  placeholder="e.g. Kilogram"
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
          name="base_unit"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Base unit</FieldLabel>
              <FieldContent>
                <Select
                  value={field.value == null ? "none" : String(field.value)}
                  onValueChange={(v) =>
                    field.onChange(v === "none" ? null : Number(v))
                  }
                  disabled={form.formState.isSubmitting || isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select base unit (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {baseUnitItems.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Leave empty if this is a base unit. Otherwise, select the unit this one converts to.
                </p>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
            </Field>
          )}
        />
        {baseUnit != null && (
          <>
            <Controller
              name="operator"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Operator</FieldLabel>
                  <FieldContent>
                    <Select
                      value={field.value ?? "none"}
                      onValueChange={(v) =>
                        field.onChange(
                          v === "none" ? null : (v as "*" | "/" | "+" | "-")
                        )
                      }
                      disabled={form.formState.isSubmitting || isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select operator" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {OPERATOR_OPTIONS.map((op) => (
                            <SelectItem key={op.value} value={op.value}>
                              {op.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                </Field>
              )}
            />
            <Controller
              name="operation_value"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Operation value</FieldLabel>
                  <FieldContent>
                    <Input
                      type="number"
                      step="any"
                      min={0}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" || Number.isNaN(Number(e.target.value))
                            ? null
                            : Number(e.target.value)
                        )
                      }
                      onBlur={field.onBlur}
                      disabled={form.formState.isSubmitting || isLoading}
                      placeholder="e.g. 1000"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                </Field>
              )}
            />
          </>
        )}
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
          form="form-unit"
          disabled={form.formState.isSubmitting || isLoading}
        >
          {form.formState.isSubmitting ? "Saving..." : unit ? "Update" : "Create"}
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
