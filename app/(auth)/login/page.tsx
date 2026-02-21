'use client'

import { Suspense, useEffect } from 'react'
import { AuthLayout } from '@/components/layout/auth-layout'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LoginForm } from '@/features/auth'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import { AUTH_REDIRECT_MESSAGE_KEY } from '@/lib/auth/constants'

export default function LoginPage() {
  useEffect(() => {
    try {
      const message = sessionStorage.getItem(AUTH_REDIRECT_MESSAGE_KEY)
      if (message) {
        sessionStorage.removeItem(AUTH_REDIRECT_MESSAGE_KEY)
        toast.error(message)
      }
    } catch {
      // ignore
    }
  }, [])

  return (
    <AuthLayout>
      <Card className='gap-4'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>Sign in</CardTitle>
          <CardDescription>
            Enter your email and password below to <br />
            log into your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className='flex justify-center py-4'><Spinner className='size-6' /></div>}>
            <LoginForm />
          </Suspense>
        </CardContent>
        <CardFooter>
          <p className='px-8 text-center text-sm text-muted-foreground'>
            By clicking sign in, you agree to our{' '}
            <a
              href='/terms'
              className='underline underline-offset-4 hover:text-primary'
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href='/privacy'
              className='underline underline-offset-4 hover:text-primary'
            >
              Privacy Policy
            </a>
            .
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}