'use client'

import { ConfigDrawer } from '@/components/config-drawer'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Spinner } from '@/components/ui/spinner'
import { UnitsDialogs } from '@/features/products/units/components/units-dialogs'
import { UnitsPrimaryButtons } from '@/features/products/units/components/units-primary-buttons'
import { UnitsProvider } from '@/features/products/units/components/units-provider'
import { UnitsTable } from '@/features/products/units/components/units-table'
import { Suspense } from 'react'

export default function Units() {
  return (
    <AuthenticatedLayout>
      <UnitsProvider>
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
              <h2 className='text-2xl font-bold tracking-tight'>Unit List</h2>
              <p className='text-muted-foreground'>
                Manage your units and their configurations here.
              </p>
            </div>
            <UnitsPrimaryButtons />
          </div>
          <Suspense fallback={<Spinner />}>
            <UnitsTable />
          </Suspense>
        </Main>

        <UnitsDialogs />
      </UnitsProvider>
    </AuthenticatedLayout>
  )
}