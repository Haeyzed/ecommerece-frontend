'use client'

import { ConfigDrawer } from '@/components/config-drawer'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Spinner } from '@/components/ui/spinner'
import { EmployeesDialogs } from '@/features/hrm/employees'
import { EmployeesPrimaryButtons } from '@/features/hrm/employees'
import { EmployeesProvider } from '@/features/hrm/employees'
import { EmployeesTable } from '@/features/hrm/employees'
import { Suspense } from 'react'

export function EmployeesClient() {
  return (
    <AuthenticatedLayout>
      <EmployeesProvider>
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
              <h2 className='text-2xl font-bold tracking-tight'>Employees List</h2>
              <p className='text-muted-foreground'>
                Manage your staff directory, salaries, locations, and roles here.
              </p>
            </div>
            <EmployeesPrimaryButtons />
          </div>
          <Suspense
            fallback={
              <div className="flex flex-1 items-center justify-center min-h-[400px]">
                <Spinner className="size-6" />
              </div>
            }
          >
            <EmployeesTable />
          </Suspense>
        </Main>

        <EmployeesDialogs />
      </EmployeesProvider>
    </AuthenticatedLayout>
  )
}