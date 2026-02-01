'use client'

import { AuthLayout } from '@/components/layout/auth-layout'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ResetPasswordForm } from '@/features/auth'
import Link from 'next/link'

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <Card className='gap-4'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>
            Reset password
          </CardTitle>
          <CardDescription>
            Enter your new password below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm />
        </CardContent>
        <CardFooter>
          <p className='px-8 text-center text-sm text-muted-foreground'>
            <Link
              href='/login'
              className='underline underline-offset-4 hover:text-primary'
            >
              Back to login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
