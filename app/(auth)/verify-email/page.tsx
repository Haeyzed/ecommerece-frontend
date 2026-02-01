'use client'

import { AuthLayout } from '@/components/layout/auth-layout'
import { VerifyEmailContent } from '@/features/auth/verify-email'

export default function VerifyEmailPage() {
  return (
    <AuthLayout>
      <VerifyEmailContent />
    </AuthLayout>
  )
}
