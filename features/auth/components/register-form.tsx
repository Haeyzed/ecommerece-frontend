"use client"

/**
 * RegisterForm
 *
 * A form component for new user registration.
 * Captures user details (name, email, password) and handles the account creation process.
 * Upon success, it redirects the user to the dashboard (or login based on flow).
 *
 * @component
 */

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import { PasswordInput } from "@/components/password-input"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { useRegister } from "@/features/auth/api"
import { type RegisterFormData, registerSchema } from "@/features/auth/schemas"
import { ValidationError } from "@/lib/api/api-errors"

export function RegisterForm() {
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  })

  const registerMutation = useRegister()

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerMutation.mutateAsync(data)
    } catch (error) {
      if (error instanceof ValidationError && error.errors) {
        Object.entries(error.errors).forEach(([field, messages]) => {
          form.setError(field as keyof RegisterFormData, {
            type: "server",
            message: messages[0],
          })
        })
      } else {
        form.setError("root", {
          type: "server",
          message: error instanceof Error ? error.message : "An error occurred",
        })
      }
    }
  }

  return (
    <form
      id="form-register"
      onSubmit={form.handleSubmit(onSubmit)}
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
                  type="text"
                  placeholder="John Doe"
                  disabled={form.formState.isSubmitting}
                  aria-invalid={fieldState.invalid}
                  autoComplete="name"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
            </Field>
          )}
        />
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>
                Email <span className="text-destructive">*</span>
              </FieldLabel>
              <FieldContent>
                <Input
                  {...field}
                  type="email"
                  placeholder="you@example.com"
                  disabled={form.formState.isSubmitting}
                  aria-invalid={fieldState.invalid}
                  autoComplete="email"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
            </Field>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>
                Password <span className="text-destructive">*</span>
              </FieldLabel>
              <FieldContent>
                <PasswordInput
                  {...field}
                  placeholder="••••••••"
                  disabled={form.formState.isSubmitting}
                  aria-invalid={fieldState.invalid}
                  autoComplete="new-password"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
            </Field>
          )}
        />
        <Controller
          name="password_confirmation"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>
                Confirm Password <span className="text-destructive">*</span>
              </FieldLabel>
              <FieldContent>
                <PasswordInput
                  {...field}
                  placeholder="••••••••"
                  disabled={form.formState.isSubmitting}
                  aria-invalid={fieldState.invalid}
                  autoComplete="new-password"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
            </Field>
          )}
        />
      </FieldGroup>

      {form.formState.errors.root && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {form.formState.errors.root.message}
        </div>
      )}

      <Button
        type="submit"
        form="form-register"
        className="w-full"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? (
          <>
            <Spinner className="mr-2 size-4" />
            Creating account...
          </>
        ) : (
          "Create account"
        )}
      </Button>
    </form>
  )
}