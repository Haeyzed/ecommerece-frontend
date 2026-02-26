'use client'

import { ConfigDrawer } from '@/components/config-drawer'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Spinner } from '@/components/ui/spinner'
import { HolidaysDialogs } from '@/features/hrm/holidays'
import { HolidaysPrimaryButtons } from '@/features/hrm/holidays'
import { HolidaysProvider } from '@/features/hrm/holidays'
import { HolidaysTable } from '@/features/hrm/holidays'
import { Suspense } from 'react'

export function HolidaysClient() {
  return (
    <AuthenticatedLayout>
      <HolidaysProvider>
        <Header fixed>
          <Search />
          <div className='ms-auto flex items-center space-x-4'>
            <ThemeSwitch />
            <ConfigDrawer />
            <ProfileDropdown />
          </div>
        </Header>

        <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
          <div className='flex flex-wrap items-end justify-between gap-2'>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>Holidays</h2>
              <p className='text-muted-foreground'>
                Manage organizational holidays, regions, and dates here.
              </p>
            </div>
            <HolidaysPrimaryButtons />
          </div>
          <Suspense
            fallback={
              <div className="flex flex-1 items-center justify-center min-h-[400px]">
                <Spinner className="size-6" />
              </div>
            }
          >
            <HolidaysTable />
          </Suspense>
        </Main>

        <HolidaysDialogs />
      </HolidaysProvider>
    </AuthenticatedLayout>
  )
}