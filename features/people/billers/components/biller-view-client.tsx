'use client'

import Link from 'next/link'
import { useBiller } from '../api'
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

type BillerViewClientProps = {
  id: string
}

export function BillerViewClient({ id }: BillerViewClientProps) {
  const billerId = Number(id)
  const { data: biller, isLoading } = useBiller(billerId)
  const { data: session } = useAuthSession()
  const canUpdate = session?.user?.user_permissions?.includes('billers-update')

  if (isLoading || !biller) {
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
            <p className="text-muted-foreground">Biller not found.</p>
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
            <h2 className="text-2xl font-bold tracking-tight">{biller.name}</h2>
            <p className="text-muted-foreground">
              {biller.company_name} · {biller.is_active ? 'Active' : 'Inactive'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/people/billers">Back to list</Link>
            </Button>
            {canUpdate && (
              <Button asChild>
                <Link href={`/people/billers/${biller.id}/edit`}>Edit</Link>
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
              {biller.company_name && <p><span className="text-muted-foreground">Company:</span> {biller.company_name}</p>}
              {biller.email && <p><span className="text-muted-foreground">Email:</span> {biller.email}</p>}
              {biller.phone_number && <p><span className="text-muted-foreground">Phone:</span> {biller.phone_number}</p>}
              {biller.vat_number && <p><span className="text-muted-foreground">VAT no:</span> {biller.vat_number}</p>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              {biller.address && <p>{biller.address}</p>}
              {(biller.city || biller.state || biller.postal_code) && (
                <p>{[biller.city, biller.state, biller.postal_code].filter(Boolean).join(', ')}</p>
              )}
              {biller.country && <p>{biller.country}</p>}
              {!biller.address && !biller.city && !biller.country && (
                <p className="text-muted-foreground">No address</p>
              )}
            </CardContent>
          </Card>
        </div>
      </Main>
    </AuthenticatedLayout>
  )
}
