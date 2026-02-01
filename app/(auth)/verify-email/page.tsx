'use client'

import { AuthLayout } from '@/components/layout/auth-layout'
import { VerifyEmailContent } from '@/features/auth'

export default function VerifyEmailPage() {
  return (
    <AuthLayout>
      <VerifyEmailContent />
    </AuthLayout>
  )
}
