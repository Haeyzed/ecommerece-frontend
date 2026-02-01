'use client'

import { ConfigDrawer } from '@/components/config-drawer'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { CategoriesDialogs } from '@/features/products/categories/components/categories-dialogs'
import { CategoriesPrimaryButtons } from '@/features/products/categories/components/categories-primary-buttons'
import { CategoriesProvider } from '@/features/products/categories/components/categories-provider'
import { CategoriesTable } from '@/features/products/categories/components/categories-table'

export default function Categories() {
  return (
    <AuthenticatedLayout>
      <CategoriesProvider>
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
                Manage your categories and their visibility here.
              </p>
            </div>
            <CategoriesPrimaryButtons />
          </div>

          <CategoriesTable />
        </Main>

        <CategoriesDialogs />
      </CategoriesProvider>
    </AuthenticatedLayout>
  )
}