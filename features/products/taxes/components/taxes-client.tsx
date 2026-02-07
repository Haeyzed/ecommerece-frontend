'use client'

import { ConfigDrawer } from '@/components/config-drawer'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Spinner } from '@/components/ui/spinner'
import { TaxesDialogs } from '@/features/products/taxes/components/taxes-dialogs'
import { TaxesPrimaryButtons } from '@/features/products/taxes/components/taxes-primary-buttons'
import { TaxesProvider } from '@/features/products/taxes/components/taxes-provider'
import { TaxesTable } from '@/features/products/taxes/components/taxes-table'
import { Suspense } from 'react'

export function TaxesClient() {
  return (
    <AuthenticatedLayout>
      <TaxesProvider>
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
              <h2 className='text-2xl font-bold tracking-tight'>Category List</h2>
              <p className='text-muted-foreground'>
                Manage your taxes and their visibility here.
              </p>
            </div>
            <TaxesPrimaryButtons />
          </div>
          <Suspense fallback={<Spinner />}>
            <TaxesTable />
          </Suspense>
        </Main>

        <TaxesDialogs />
      </TaxesProvider>
    </AuthenticatedLayout>
  )
}