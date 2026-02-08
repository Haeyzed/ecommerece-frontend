'use client'

import { ConfigDrawer } from '@/components/config-drawer'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Spinner } from '@/components/ui/spinner'
import { WarehousesDialogs } from '@/features/settings/warehouses/components/warehouses-dialogs'
import { WarehousesPrimaryButtons } from '@/features/settings/warehouses/components/warehouses-primary-buttons'
import { WarehousesProvider } from '@/features/settings/warehouses/components/warehouses-provider'
import { WarehousesTable } from '@/features/settings/warehouses/components/warehouses-table'
import { Suspense } from 'react'

export function WarehousesClient() {
  return (
    <AuthenticatedLayout>
      <WarehousesProvider>
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
              <h2 className='text-2xl font-bold tracking-tight'>Warehouses List</h2>
              <p className='text-muted-foreground'>
                Manage your warehouses and their visibility here.
              </p>
            </div>
            <WarehousesPrimaryButtons />
          </div>
          <Suspense fallback={<Spinner />}>
            <WarehousesTable />
          </Suspense>
        </Main>

        <WarehousesDialogs />
      </WarehousesProvider>
    </AuthenticatedLayout>
  )
}
