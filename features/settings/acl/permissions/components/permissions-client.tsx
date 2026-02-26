'use client'

import { ConfigDrawer } from '@/components/config-drawer'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Spinner } from '@/components/ui/spinner'
import { PermissionsDialogs } from '@/features/settings/acl/permissions'
import { PermissionsPrimaryButtons } from '@/features/settings/acl/permissions'
import { PermissionsProvider } from '@/features/settings/acl/permissions'
import { PermissionsTable } from '@/features/settings/acl/permissions'
import { Suspense } from 'react'

export function PermissionsClient() {
  return (
    <AuthenticatedLayout>
      <PermissionsProvider>
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
              <h2 className='text-2xl font-bold tracking-tight'>Permissions List</h2>
              <p className='text-muted-foreground'>
                Manage system permissions, modules, and guards here.
              </p>
            </div>
            <PermissionsPrimaryButtons />
          </div>
          <Suspense
            fallback={
              <div className="flex flex-1 items-center justify-center min-h-[400px]">
                <Spinner className="size-6" />
              </div>
            }
          >
            <PermissionsTable />
          </Suspense>
        </Main>

        <PermissionsDialogs />
      </PermissionsProvider>
    </AuthenticatedLayout>
  )
}