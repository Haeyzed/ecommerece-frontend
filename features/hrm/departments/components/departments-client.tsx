'use client'

import { ConfigDrawer } from '@/components/config-drawer'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Spinner } from '@/components/ui/spinner'
import { DepartmentsDialogs } from '@/features/hrm/departments/components/departments-dialogs'
import { DepartmentsPrimaryButtons } from '@/features/hrm/departments/components/departments-primary-buttons'
import { DepartmentsProvider } from '@/features/hrm/departments/components/departments-provider'
import { DepartmentsTable } from '@/features/hrm/departments/components/departments-table'
import { Suspense } from 'react'

export function DepartmentsClient() {
  return (
    <AuthenticatedLayout>
      <DepartmentsProvider>
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
              <h2 className='text-2xl font-bold tracking-tight'>Departments List</h2>
              <p className='text-muted-foreground'>
                Manage your departments and their visibility here.
              </p>
            </div>
            <DepartmentsPrimaryButtons />
          </div>
          <Suspense
            fallback={
              <div className="flex flex-1 items-center justify-center min-h-[400px]">
                <Spinner className="size-6" />
              </div>
            }
          >
            <DepartmentsTable />
          </Suspense>
        </Main>

        <DepartmentsDialogs />
      </DepartmentsProvider>
    </AuthenticatedLayout>
  )
}