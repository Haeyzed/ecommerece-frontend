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
import { useSmsProviders, useUpdateSmsProvider } from '@/features/settings/sms/api'
import type { SmsSettingUpdateData } from '@/features/settings/sms/schemas'
import { SmsSettingForm } from './sms-setting-form'

export function SmsSettingClient() {
  const { data: providers = [], isLoading, isSessionLoading, error, isError } = useSmsProviders()
  const { mutate: updateProvider, isPending } = useUpdateSmsProvider()
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const selectedProvider = selectedId ? providers.find((p) => p.id === selectedId) ?? null : null

  useEffect(() => {
    if (isError && error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load SMS providers')
    }
  }, [isError, error])

  const handleSubmit = (id: number, data: SmsSettingUpdateData) => {
    updateProvider({ id, data })
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
          <h2 className="text-2xl font-bold tracking-tight">SMS Setting</h2>
          <p className="text-muted-foreground">
            Configure SMS gateways (Twilio, Tonkra, Revesms, etc.). Select a gateway and set credentials.
          </p>
        </div>

        <SmsSettingForm
          providers={providers}
          selectedProvider={selectedProvider}
          onSelectProvider={setSelectedId}
          onSubmit={handleSubmit}
          isPending={isPending}
        />
      </Main>
    </AuthenticatedLayout>
  )
}
