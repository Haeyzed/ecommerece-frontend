'use client'

import { ConfigDrawer } from '@/components/config-drawer'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Spinner } from '@/components/ui/spinner'
import { CountriesDialogs } from '@/features/settings/countries/components/countries-dialogs'
import { CountriesPrimaryButtons } from '@/features/settings/countries/components/countries-primary-buttons'
import { CountriesProvider } from '@/features/settings/countries/components/countries-provider'
import { CountriesTable } from '@/features/settings/countries/components/countries-table'
import { COUNTRY_LIST_DESCRIPTION, COUNTRY_LIST_TITLE } from '@/features/settings/countries/constants'
import { Suspense } from 'react'

export function CountriesClient() {
  return (
    <AuthenticatedLayout>
      <CountriesProvider>
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
              <h2 className='text-2xl font-bold tracking-tight'>{COUNTRY_LIST_TITLE}</h2>
              <p className='text-muted-foreground'>{COUNTRY_LIST_DESCRIPTION}</p>
            </div>
            <CountriesPrimaryButtons />
          </div>
          <Suspense fallback={<Spinner />}>
            <CountriesTable />
          </Suspense>
        </Main>

        <CountriesDialogs />
      </CountriesProvider>
    </AuthenticatedLayout>
  )
}
