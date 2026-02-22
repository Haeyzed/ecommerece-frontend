'use client'

import { ConfigDrawer } from '@/components/config-drawer'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Spinner } from '@/components/ui/spinner'
import { CitiesDialogs } from '@/features/settings/cities/components/cities-dialogs'
import { CitiesPrimaryButtons } from '@/features/settings/cities/components/cities-primary-buttons'
import { CitiesProvider } from '@/features/settings/cities/components/cities-provider'
import { CitiesTable } from '@/features/settings/cities/components/cities-table'
import { Suspense } from 'react'

export function CitiesClient() {
  return (
    <AuthenticatedLayout>
      <CitiesProvider>
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
              <h2 className='text-2xl font-bold tracking-tight'>Cities List</h2>
              <p className='text-muted-foreground'>
                View World reference cities.
              </p>
            </div>
            <CitiesPrimaryButtons />
          </div>
          <Suspense fallback={<Spinner />}>
            <CitiesTable />
          </Suspense>
        </Main>

        <CitiesDialogs />
      </CitiesProvider>
    </AuthenticatedLayout>
  )
}