"use client"

/**
 * LockScreenForm
 *
 * A compact form for unlocking the screen.
 * It requires only the user's password to re-authenticate the session.
 * Handles unauthorized errors by redirecting to the full login page.
 *
 * @component
 * @param {Object} props - The component props
 * @param {string} [props.className] - Optional CSS class names
 */

import { zodResolver } from "@hookform/resolvers/zod"
import { LockKeyIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

import { PasswordInput } from "@/components/password-input"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { useUnlock } from "@/features/auth/api"
import { UnauthorizedError } from "@/lib/api/api-errors"
import { useLockScreen } from "@/lib/providers/lockscreen-provider"
import { LockScreenFormData, lockScreenSchema } from "../schemas"

export function LockScreenForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setLocked } = useLockScreen()
  const unlockMutation = useUnlock()

  const form = useForm<LockScreenFormData>({
    resolver: zodResolver(lockScreenSchema),
    defaultValues: { password: "" },
  })

  const onSubmit = async (data: LockScreenFormData) => {
    try {
      await unlockMutation.mutateAsync({ password: data.password })
      setLocked(false)
      toast.success("Unlocked successfully")
      
      // Check for returnUrl in query params
      const returnUrl = searchParams.get('returnUrl')
      if (returnUrl) {
        router.replace(returnUrl)
      } else {
        router.replace("/dashboard")
      }
      
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        setLocked(false)
        router.push("/login")
      } else {
        toast.error(error instanceof Error ? error.message : "Unlock failed")
      }
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Controller
        control={form.control}
        name="password"
        render={({ field, fieldState }) => (
          <Field data-invalid={!!fieldState.error}>
            <FieldLabel>Password</FieldLabel>
            <PasswordInput
              placeholder="Enter your password"
              {...field}
              autoComplete="current-password"
            />
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Button
        className="mt-2 w-full"
        type="submit"
        disabled={unlockMutation.isPending}
      >
        {unlockMutation.isPending ? (
          <Spinner />
        ) : (
          <HugeiconsIcon icon={LockKeyIcon} className="size-4" />
        )}
        Unlock
      </Button>
    </form>
  )
}