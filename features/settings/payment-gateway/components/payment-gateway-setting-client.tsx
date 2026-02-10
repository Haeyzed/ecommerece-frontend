'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { ConfigDrawer } from '@/components/config-drawer'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Spinner } from '@/components/ui/spinner'
import { usePaymentGateways, useUpdatePaymentGateway } from '@/features/settings/payment-gateway/api'
import type { PaymentGatewayUpdateData } from '@/features/settings/payment-gateway/schemas'
import { PaymentGatewaySettingForm } from './payment-gateway-setting-form'

export function PaymentGatewaySettingClient() {
  const { data: gatewaysData, isLoading, isSessionLoading, error, isError } = usePaymentGateways()
  const gateways = Array.isArray(gatewaysData) ? gatewaysData : []
  const { mutate: updateGateway, isPending, variables } = useUpdatePaymentGateway()
  const [pendingId, setPendingId] = useState<number | null>(null)

  useEffect(() => {
    if (isError && error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load payment gateways')
    }
  }, [isError, error])

  const handleSubmit = (id: number, data: PaymentGatewayUpdateData) => {
    setPendingId(id)
    updateGateway({ id, data }, { onSettled: () => setPendingId(null) })
  }

  const isLoadingOrSession = isSessionLoading || isLoading

  if (isLoadingOrSession) {
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
          <Spinner className="size-8" />
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
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Payment Gateways</h2>
          <p className="text-muted-foreground">
            Configure payment gateways. Set credentials and choose which modules use each gateway.
          </p>
        </div>
        {gateways.length === 0 ? (
          <p className="text-muted-foreground">No payment gateways configured.</p>
        ) : (
          <div className="space-y-6">
            {gateways.map((gateway) => (
              <PaymentGatewaySettingForm
                key={gateway.id}
                gateway={gateway}
                onSubmit={handleSubmit}
                isPending={isPending && (variables?.id === gateway.id || pendingId === gateway.id)}
              />
            ))}
          </div>
        )}
      </Main>
    </AuthenticatedLayout>
  )
}
