"use client"

/**
 * ResetPasswordForm
 *
 * A form component to handle the final step of password recovery.
 * Uses a token and email (typically from URL query params) to validate the request
 * and set a new password.
 *
 * @component
 */

import { zodResolver } from "@hookform/resolvers/zod"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
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
import { useResetPassword } from "@/features/auth/api"
import {
  type ResetPasswordFormData,
  resetPasswordSchema,
} from "@/features/auth"
import { ValidationError } from "@/lib/api/api-errors"

export function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const email = searchParams.get("email")

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: email ?? "",
      token: token ?? "",
      password: "",
      password_confirmation: "",
    },
  })

  const resetPasswordMutation = useResetPassword()

  useEffect(() => {
    if (token) form.setValue("token", token)
    if (email) form.setValue("email", email)
  }, [token, email, form.setValue])

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await resetPasswordMutation.mutateAsync(data)
    } catch (error) {
      if (error instanceof ValidationError && error.errors) {
        Object.entries(error.errors).forEach(([field, messages]) => {
          form.setError(field as keyof ResetPasswordFormData, {
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
      id="form-reset-password"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <Controller
        name="token"
        control={form.control}
        render={({ field }) => <input type="hidden" {...field} />}
      />
      <FieldGroup>
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
                  disabled={form.formState.isSubmitting || !!email}
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
                New Password <span className="text-destructive">*</span>
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
        form="form-reset-password"
        className="w-full"
        disabled={form.formState.isSubmitting || !token}
      >
        {form.formState.isSubmitting ? (
          <>
            <Spinner className="mr-2 size-4" />
            Resetting...
          </>
        ) : (
          "Reset password"
        )}
      </Button>
    </form>
  )
}