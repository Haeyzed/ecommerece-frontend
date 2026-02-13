'use client'

import { Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'

type ForbiddenErrorProps = {
  /** Optional message from API (e.g. "Permission denied for viewing brands list.") */
  message?: string | null
  /** When true, renders only the 403 content (for use inside existing layouts) */
  inline?: boolean
}

export function ForbiddenError({ message, inline }: ForbiddenErrorProps = {}) {
  const router = useRouter()

  const content = (
    <div className="m-auto flex flex-col items-center justify-center gap-2 py-12">
      <h1 className="text-[7rem] leading-tight font-bold">403</h1>
      <span className="font-medium">Access Forbidden</span>
      <p className="text-center text-muted-foreground">
        {message ?? (
          <>
            You don't have necessary permission <br />
            to view this resource.
          </>
        )}
      </p>
      <div className="mt-6 flex gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          Go Back
        </Button>
        <Button onClick={() => router.push('/')}>Back to Home</Button>
      </div>
    </div>
  )

  if (inline) {
    return <div className="flex flex-1 flex-col">{content}</div>
  }

  return (
    <AuthenticatedLayout>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <Suspense fallback={<Spinner />}>
          <div className="h-svh">{content}</div>
        </Suspense>
      </Main>
    </AuthenticatedLayout>
  )
}

