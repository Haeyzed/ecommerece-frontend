'use client'

import { ConfigDrawer } from '@/components/config-drawer'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Spinner } from '@/components/ui/spinner'
import { LeaveTypesDialogs } from '@/features/hrm/leave-types'
import { LeaveTypesPrimaryButtons } from '@/features/hrm/leave-types'
import { LeaveTypesProvider } from '@/features/hrm/leave-types'
import { LeaveTypesTable } from '@/features/hrm/leave-types'
import { Suspense } from 'react'

export function LeaveTypesClient() {
  return (
    <AuthenticatedLayout>
      <LeaveTypesProvider>
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
              <h2 className='text-2xl font-bold tracking-tight'>Leave Types List</h2>
              <p className='text-muted-foreground'>
                Manage employee leave categories and their respective quotas here.
              </p>
            </div>
            <LeaveTypesPrimaryButtons />
          </div>
          <Suspense
            fallback={
              <div className="flex flex-1 items-center justify-center min-h-[400px]">
                <Spinner className="size-6" />
              </div>
            }
          >
            <LeaveTypesTable />
          </Suspense>
        </Main>

        <LeaveTypesDialogs />
      </LeaveTypesProvider>
    </AuthenticatedLayout>
  )
}