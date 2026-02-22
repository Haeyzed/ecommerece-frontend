'use client'

import { ConfigDrawer } from '@/components/config-drawer'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Spinner } from '@/components/ui/spinner'
import { CurrenciesDialogs } from '@/features/settings/currencies/components/currencies-dialogs'
import { CurrenciesPrimaryButtons } from '@/features/settings/currencies/components/currencies-primary-buttons'
import { CurrenciesProvider } from '@/features/settings/currencies/components/currencies-provider'
import { CurrenciesTable } from '@/features/settings/currencies/components/currencies-table'
import { Suspense } from 'react'

export function CurrenciesClient() {
  return (
    <AuthenticatedLayout>
      <CurrenciesProvider>
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
              <h2 className='text-2xl font-bold tracking-tight'>Currencies List</h2>
              <p className='text-muted-foreground'>
                View World reference currencies.
              </p>
            </div>
            <CurrenciesPrimaryButtons />
          </div>
          <Suspense fallback={<Spinner />}>
            <CurrenciesTable />
          </Suspense>
        </Main>

        <CurrenciesDialogs />
      </CurrenciesProvider>
    </AuthenticatedLayout>
  )
}