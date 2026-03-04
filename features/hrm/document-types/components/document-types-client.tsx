'use client'

import { Suspense } from 'react'

import { Spinner } from '@/components/ui/spinner'

import { ConfigDrawer } from '@/components/config-drawer'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

import {
  DocumentTypesDialogs,
  DocumentTypesPrimaryButtons,
  DocumentTypesProvider,
  DocumentTypesTable,
} from '@/features/hrm/document-types'

export function DocumentTypesClient() {
  return (
    <AuthenticatedLayout>
      <DocumentTypesProvider>
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
              <h2 className='text-2xl font-bold tracking-tight'>
                Document Types List
              </h2>
              <p className='text-muted-foreground'>
                Manage employee document categories and their respective quotas
                here.
              </p>
            </div>
            <DocumentTypesPrimaryButtons />
          </div>
          <Suspense
            fallback={
              <div className='flex min-h-[400px] flex-1 items-center justify-center'>
                <Spinner className='size-6' />
              </div>
            }
          >
            <DocumentTypesTable />
          </Suspense>
        </Main>

        <DocumentTypesDialogs />
      </DocumentTypesProvider>
    </AuthenticatedLayout>
  )
}
