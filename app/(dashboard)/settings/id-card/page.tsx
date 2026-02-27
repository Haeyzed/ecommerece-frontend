import { IdCardDesigner } from '@/features/settings/id-card-templates/components/id-card-designer'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { CitiesDialogs, CitiesPrimaryButtons, CitiesProvider, CitiesTable } from '@/features/settings/cities'
import { Header } from '@/components/layout/header'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Main } from '@/components/layout/main'
import { Suspense } from 'react'
import { Spinner } from '@/components/ui/spinner'

export const metadata = {
  title: 'ID Card Designer | Settings',
}

export default function IdCardSettingsPage() {
  return (

    <AuthenticatedLayout>
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
              <h2 className='text-2xl font-bold tracking-tight'>ID Card Designer</h2>
              <p className='text-muted-foreground'>
                Design Employer ID Card.
              </p>
            </div>
            <CitiesPrimaryButtons />
          </div>
          <Suspense fallback={<Spinner />}>
            <IdCardDesigner />
          </Suspense>
        </Main>

        <CitiesDialogs />
    </AuthenticatedLayout>
  )
}