'use client'

import { ConfigDrawer } from '@/components/config-drawer'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Spinner } from '@/components/ui/spinner'
import { TimezonesDialogs } from '@/features/settings/timezones/components/timezones-dialogs'
import { TimezonesPrimaryButtons } from '@/features/settings/timezones/components/timezones-primary-buttons'
import { TimezonesProvider } from '@/features/settings/timezones/components/timezones-provider'
import { TimezonesTable } from '@/features/settings/timezones/components/timezones-table'
import { Suspense } from 'react'

export function TimezonesClient() {
  return (
    <AuthenticatedLayout>
      <TimezonesProvider>
        <Header fixed>
          <Search />
          <div className="ms-auto flex items-center space-x-4">
            <ThemeSwitch />
            <ConfigDrawer />
            <ProfileDropdown />
          </div>
        </Header>

        <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>Timezones List</h2>
              <p className='text-muted-foreground'>
                View World reference timezones.
              </p>
            </div>
            <TimezonesPrimaryButtons />
          </div>
          <Suspense fallback={<Spinner />}>
            <TimezonesTable />
          </Suspense>
        </Main>

        <TimezonesDialogs />
      </TimezonesProvider>
    </AuthenticatedLayout>
  )
}