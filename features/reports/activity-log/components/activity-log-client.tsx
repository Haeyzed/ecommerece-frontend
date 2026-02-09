'use client'

import { ConfigDrawer } from '@/components/config-drawer'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Spinner } from '@/components/ui/spinner'
import { ActivityLogTable } from './activity-log-table'
import { Suspense } from 'react'

export function ActivityLogClient() {
  return (
    <AuthenticatedLayout>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Audit Log</h2>
          <p className='text-muted-foreground'>
            View audit trail from Laravel Auditing. Full event, model, and value change history.
          </p>
        </div>
        <Suspense fallback={<Spinner />}>
          <ActivityLogTable />
        </Suspense>
      </Main>
    </AuthenticatedLayout>
  )
}
