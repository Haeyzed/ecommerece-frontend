'use client'

/**
 * Verify Email Page
 *
 * This page handles the email verification flow. It wraps the content in Suspense
 * because `VerifyEmailContent` relies on `useSearchParams`, which requires a
 * client-side suspense boundary to function correctly during SSG/SSR.
 */

import { Suspense } from 'react'
import { AuthLayout } from '@/components/layout/auth-layout'
import { VerifyEmailContent } from '@/features/auth'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'

export default function VerifyEmailPage() {
  return (
    <AuthLayout>
      <Suspense
        fallback={
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
          </Card>
        }
      >
        <VerifyEmailContent />
      </Suspense>
    </AuthLayout>
  )
}