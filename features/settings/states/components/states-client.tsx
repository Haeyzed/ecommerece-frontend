'use client'

import { ConfigDrawer } from '@/components/config-drawer'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Spinner } from '@/components/ui/spinner'
import { StatesDialogs } from '@/features/settings/states/components/states-dialogs'
import { StatesPrimaryButtons } from '@/features/settings/states/components/states-primary-buttons'
import { StatesProvider } from '@/features/settings/states/components/states-provider'
import { StatesTable } from '@/features/settings/states/components/states-table'
import { Suspense } from 'react'

export function StatesClient() {
  return (
    <AuthenticatedLayout>
      <StatesProvider>
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
              <h2 className='text-2xl font-bold tracking-tight'>States List</h2>
              <p className='text-muted-foreground'>
                View World reference states.
              </p>
            </div>
            <StatesPrimaryButtons />
          </div>
          <Suspense fallback={<Spinner />}>
            <StatesTable />
          </Suspense>
        </Main>

        <StatesDialogs />
      </StatesProvider>
    </AuthenticatedLayout>
  )
}
