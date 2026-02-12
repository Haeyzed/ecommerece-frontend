'use client'

import { ConfigDrawer } from '@/components/config-drawer'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Spinner } from '@/components/ui/spinner'
import { BillersDialogs } from './billers-dialogs'
import { BillersPrimaryButtons } from './billers-primary-buttons'
import { BillersProvider } from './billers-provider'
import { BillersTable } from './billers-table'
import { Suspense } from 'react'

export function BillersClient() {
  return (
    <AuthenticatedLayout>
      <BillersProvider>
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
              <h2 className="text-2xl font-bold tracking-tight">Billers</h2>
              <p className="text-muted-foreground">
                Manage your billers and outlet locations.
              </p>
            </div>
            <BillersPrimaryButtons />
          </div>
          <Suspense fallback={<Spinner />}>
            <BillersTable />
          </Suspense>
        </Main>

        <BillersDialogs />
      </BillersProvider>
    </AuthenticatedLayout>
  )
}
