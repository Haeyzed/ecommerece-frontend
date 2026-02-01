"use client";

/**
 * LoginForm
 *
 * A client-side form component for user authentication.
 * Integrates with React Hook Form for validation and TanStack Query for API submission.
 * Includes social login buttons and navigation links to registration/recovery.
 *
 * @component
 */

import { IconFacebook, IconGithub } from "@/assets/brand-icons";
import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useLogin } from "@/features/auth/api";
import { type LoginFormData, loginSchema } from "@/features/auth/schemas";
import { ValidationError } from "@/lib/api/api-errors";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";

export function LoginForm() {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "" },
  });

  const loginMutation = useLogin();

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(data);
    } catch (error) {
      if (error instanceof ValidationError && error.errors) {
        Object.entries(error.errors).forEach(([field, messages]) => {
          form.setError(field as keyof LoginFormData, {
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
      id="form-login"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <FieldGroup>
        <Controller
          name="identifier"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>
                Email or Username <span className="text-destructive">*</span>
              </FieldLabel>
              <FieldContent>
                <Input
                  {...field}
                  type="text"
                  placeholder="Email or username"
                  disabled={form.formState.isSubmitting}
                  aria-invalid={fieldState.invalid}
                  autoComplete="username"
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
                  autoComplete="current-password"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex items-center justify-between">
        <Link
          href="/forgot-password"
          className="text-sm text-primary hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        className="mt-2 w-full"
        type="submit"
        form="form-login"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? (
          <>
            <Spinner className="mr-2 size-4" />
            Logging in...
          </>
        ) : (
          "Login"
        )}
      </Button>

      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-primary hover:underline">
          Sign up
        </Link>
      </div>

      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          type="button"
          disabled={form.formState.isSubmitting}
        >
          <IconGithub className="h-4 w-4" /> GitHub
        </Button>
        <Button
          variant="outline"
          type="button"
          disabled={form.formState.isSubmitting}
        >
          <IconFacebook className="h-4 w-4" /> Facebook
        </Button>
      </div>
    </form>
  );
}