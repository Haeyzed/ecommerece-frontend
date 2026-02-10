'use client'

import Link from 'next/link'
import { useCustomer } from '../api'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { useAuthSession } from '@/features/auth/api'

type CustomerViewClientProps = {
  id: string
}

export function CustomerViewClient({ id }: CustomerViewClientProps) {
  const customerId = Number(id)
  const { data: customer, isLoading } = useCustomer(customerId)
  const { data: session } = useAuthSession()
  const canUpdate = session?.user?.user_permissions?.includes('customers-update')

  if (isLoading || !customer) {
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
        <Main className="flex flex-1 items-center justify-center">
          {isLoading ? (
            <Spinner className="size-8" />
          ) : (
            <p className="text-muted-foreground">Customer not found.</p>
          )}
        </Main>
      </AuthenticatedLayout>
    )
  }

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
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{customer.name}</h2>
            <p className="text-muted-foreground">
              {customer.customer_group?.name ?? 'No group'} · {customer.is_active ? 'Active' : 'Inactive'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/people/customers">Back to list</Link>
            </Button>
            {canUpdate && (
              <Button asChild>
                <Link href={`/people/customers/${customer.id}/edit`}>Edit</Link>
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              {customer.company_name && <p><span className="text-muted-foreground">Company:</span> {customer.company_name}</p>}
              {customer.email && <p><span className="text-muted-foreground">Email:</span> {customer.email}</p>}
              {customer.phone_number && <p><span className="text-muted-foreground">Phone:</span> {customer.phone_number}</p>}
              {customer.wa_number && <p><span className="text-muted-foreground">WhatsApp:</span> {customer.wa_number}</p>}
              {customer.tax_no && <p><span className="text-muted-foreground">Tax no:</span> {customer.tax_no}</p>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              {customer.address && <p>{customer.address}</p>}
              {(customer.city || customer.state || customer.postal_code) && (
                <p>{[customer.city, customer.state, customer.postal_code].filter(Boolean).join(', ')}</p>
              )}
              {customer.country && <p>{customer.country}</p>}
              {!customer.address && !customer.city && !customer.country && (
                <p className="text-muted-foreground">No address</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Financial</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p><span className="text-muted-foreground">Opening balance:</span> {Number(customer.opening_balance).toFixed(2)}</p>
              <p><span className="text-muted-foreground">Credit limit:</span> {Number(customer.credit_limit).toFixed(2)}</p>
              <p><span className="text-muted-foreground">Deposit:</span> {Number(customer.deposit).toFixed(2)}</p>
              <p><span className="text-muted-foreground">Deposited balance:</span> {Number(customer.deposited_balance ?? customer.deposit ?? 0).toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>
      </Main>
    </AuthenticatedLayout>
  )
}
