'use client'

import { ConfigDrawer } from '@/components/config-drawer'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Spinner } from '@/components/ui/spinner'
import { CustomersDialogs } from './customers-dialogs'
import { CustomersPrimaryButtons } from './customers-primary-buttons'
import { CustomersProvider } from './customers-provider'
import { CustomersTable } from './customers-table'
import { Suspense } from 'react'

export function CustomersClient() {
  return (
    <AuthenticatedLayout>
      <CustomersProvider>
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
              <h2 className="text-2xl font-bold tracking-tight">Customers</h2>
              <p className="text-muted-foreground">
                Manage your customers and their details.
              </p>
            </div>
            <CustomersPrimaryButtons />
          </div>
          <Suspense fallback={<Spinner />}>
            <CustomersTable />
          </Suspense>
        </Main>

        <CustomersDialogs />
      </CustomersProvider>
    </AuthenticatedLayout>
  )
}
