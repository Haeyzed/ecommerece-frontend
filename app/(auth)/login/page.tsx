'use client'

import { Suspense } from 'react'
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

export default function LoginPage() {
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
          {/* LoginForm uses useSearchParams() internally (via useLogin hook).
            It must be wrapped in Suspense to allow Next.js to pre-render 
            this page statically while the search params are determined on the client.
          */}
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