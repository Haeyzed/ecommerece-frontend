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
import { Spinner } from '@/components/ui/spinner'
import { LoginForm, ResetPasswordForm } from '@/features/auth'
import Link from 'next/link'
import { Suspense } from 'react'

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
        <Suspense fallback={<div className='flex justify-center py-4'><Spinner className='size-6' /></div>}>
          <ResetPasswordForm />
          </Suspense>
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
