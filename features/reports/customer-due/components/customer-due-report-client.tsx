'use client'

import { Suspense } from 'react'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Spinner } from '@/components/ui/spinner'
import { CustomerDueReportProvider } from './customer-due-report-provider'
import { CustomerDueReportPrimaryButtons } from './customer-due-report-primary-buttons'
import { CustomerDueReportTable } from './customer-due-report-table'
import { CustomerDueReportExportDialog } from './customer-due-report-export-dialog'
import { useCustomerDueReportDialog } from './customer-due-report-provider'

function CustomerDueReportDialogs() {
  const { open, setOpen } = useCustomerDueReportDialog()
  return (
    <CustomerDueReportExportDialog
      open={open === 'export'}
      onOpenChange={(state) => setOpen(state ? 'export' : null)}
    />
  )
}

export function CustomerDueReportClient() {
  return (
    <AuthenticatedLayout>
      <CustomerDueReportProvider>
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
              <h2 className="text-2xl font-bold tracking-tight">
                Customer Due Report
              </h2>
              <p className="text-muted-foreground">
                Unpaid sales in the selected date range. Filter by customer
                optionally.
              </p>
            </div>
            <CustomerDueReportPrimaryButtons />
          </div>
          <Suspense fallback={<Spinner />}>
            <CustomerDueReportTable />
          </Suspense>

          <CustomerDueReportDialogs />
        </Main>
      </CustomerDueReportProvider>
    </AuthenticatedLayout>
  )
}
