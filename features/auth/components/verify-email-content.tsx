"use client"

/**
 * VerifyEmailContent
 *
 * Handles the email verification logic.
 * It extracts the verification token from the URL, automatically attempts
 * to verify it against the API, and displays the appropriate status (loading, success, error).
 *
 * @component
 */

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { useVerifyEmail } from "@/features/auth/api"

export function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [status, setStatus] = useState<
    "idle" | "verifying" | "success" | "error"
  >("idle")
  const [errorMessage, setErrorMessage] = useState<string>("")

  const verifyEmailMutation = useVerifyEmail()

  useEffect(() => {
    if (token) {
      handleVerify()
    }
  }, [token])

  const handleVerify = async () => {
    if (!token) return

    setStatus("verifying")
    try {
      await verifyEmailMutation.mutateAsync(token)
      setStatus("success")
    } catch (error) {
      setStatus("error")
      setErrorMessage(
        error instanceof Error ? error.message : "Verification failed"
      )
    }
  }

  if (!token) {
    return (
      <Card className="gap-4">
        <CardHeader>
          <CardTitle className="text-lg tracking-tight">
            Invalid verification link
          </CardTitle>
          <CardDescription>
            The verification link is missing or invalid.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/login">
            <Button className="w-full">Go to login</Button>
          </Link>
        </CardContent>
        <CardFooter>
          <p className="px-8 text-center text-sm text-muted-foreground">
            <Link
              href="/login"
              className="underline underline-offset-4 hover:text-primary"
            >
              Back to login
            </Link>
          </p>
        </CardFooter>
      </Card>
    )
  }

  if (status === "success") {
    return (
      <Card className="gap-4">
        <CardHeader>
          <CardTitle className="text-lg tracking-tight">
            Email verified
          </CardTitle>
          <CardDescription>
            Your email has been successfully verified. You can now sign in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/login">
            <Button className="w-full">Go to login</Button>
          </Link>
        </CardContent>
        <CardFooter>
          <p className="px-8 text-center text-sm text-muted-foreground">
            <Link
              href="/login"
              className="underline underline-offset-4 hover:text-primary"
            >
              Back to login
            </Link>
          </p>
        </CardFooter>
      </Card>
    )
  }

  if (status === "error") {
    return (
      <Card className="gap-4">
        <CardHeader>
          <CardTitle className="text-lg tracking-tight">
            Verification failed
          </CardTitle>
          <CardDescription>{errorMessage}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Button onClick={handleVerify} className="w-full">
            Try again
          </Button>
          <Link href="/login">
            <Button variant="outline" className="w-full">
              Go to login
            </Button>
          </Link>
        </CardContent>
        <CardFooter>
          <p className="px-8 text-center text-sm text-muted-foreground">
            <Link
              href="/login"
              className="underline underline-offset-4 hover:text-primary"
            >
              Back to login
            </Link>
          </p>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="text-lg tracking-tight">
          Verifying email
        </CardTitle>
        <CardDescription>Please wait...</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center py-6">
        <Spinner className="size-8" />
      </CardContent>
      <CardFooter>
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href="/login"
            className="underline underline-offset-4 hover:text-primary"
          >
            Back to login
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}