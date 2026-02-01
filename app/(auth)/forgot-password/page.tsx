'use client'

import { AuthLayout } from '@/components/layout/auth-layout'
import { Card } from '@/components/ui/card'
import { ForgotPasswordForm } from '@/features/auth/forgot-password'

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <Card className='gap-4'>
        <ForgotPasswordForm />
      </Card>
    </AuthLayout>
  )
}
