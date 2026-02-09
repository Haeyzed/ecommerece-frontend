'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { ConfigDrawer } from '@/components/config-drawer'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Spinner } from '@/components/ui/spinner'
import { useMailSetting, useUpdateMailSetting } from '@/features/settings/mail/api'
import { mailSettingSchema, type MailSettingFormData } from '@/features/settings/mail/schemas'
import { MailSettingForm } from './mail-setting-form'

export function MailSettingClient() {
  const { data: setting, isLoading, isSessionLoading, error, isError } = useMailSetting()
  const { mutate: updateSetting, isPending } = useUpdateMailSetting()

  const form = useForm<MailSettingFormData>({
    resolver: zodResolver(mailSettingSchema),
    defaultValues: {
      driver: '',
      host: '',
      port: '',
      from_address: '',
      from_name: '',
      username: '',
      password: '',
      encryption: '',
      send_test: false,
    },
  })

  useEffect(() => {
    if (!setting) return
    form.reset({
      driver: setting.driver ?? '',
      host: setting.host ?? '',
      port: setting.port ?? '',
      from_address: setting.from_address ?? '',
      from_name: setting.from_name ?? '',
      username: setting.username ?? '',
      password: '', // Never pre-fill password (API returns masked value)
      encryption: setting.encryption ?? '',
      send_test: false,
    })
  }, [setting, form])

  const onSubmit = (data: MailSettingFormData) => {
    updateSetting(data)
  }

  useEffect(() => {
    if (isError && error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load mail setting')
    }
  }, [isError, error])

  const isLoadingOrSession = isSessionLoading || (isLoading && !setting)

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
          <h2 className="text-2xl font-bold tracking-tight">Mail Setting</h2>
          <p className="text-muted-foreground">
            Configure SMTP for outgoing emails. You can send a test email after saving.
          </p>
        </div>

        <MailSettingForm
          form={form}
          onSubmit={onSubmit}
          id="mail-setting-form"
          isPending={isPending}
        />
      </Main>
    </AuthenticatedLayout>
  )
}
