'use client'

import { ConfigDrawer } from '@/components/config-drawer'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Spinner } from '@/components/ui/spinner'
import { LanguagesDialogs } from './languages-dialogs'
import { LanguagesPrimaryButtons } from './languages-primary-buttons'
import { LanguagesProvider } from './languages-provider'
import { LanguagesTable } from './languages-table'
import { Suspense } from 'react'

export function LanguagesClient() {
  return (
    <AuthenticatedLayout>
      <LanguagesProvider>
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
              <h2 className='text-2xl font-bold tracking-tight'>Languages List</h2>
              <p className='text-muted-foreground'>View world reference languages.</p>
            </div>
            <LanguagesPrimaryButtons />
          </div>
          <Suspense fallback={<Spinner />}>
            <LanguagesTable />
          </Suspense>
        </Main>

        <LanguagesDialogs />
      </LanguagesProvider>
    </AuthenticatedLayout>
  )
}
