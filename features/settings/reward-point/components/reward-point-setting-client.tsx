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
import { useRewardPointSetting, useUpdateRewardPointSetting } from '@/features/settings/reward-point/api'
import {
  rewardPointSettingSchema,
  type RewardPointSettingFormData,
} from '@/features/settings/reward-point/schemas'
import { RewardPointSettingForm } from './reward-point-setting-form'

export function RewardPointSettingClient() {
  const { data: setting, isLoading, isSessionLoading, error, isError } = useRewardPointSetting()
  const { mutate: updateSetting, isPending } = useUpdateRewardPointSetting()

  const form = useForm<RewardPointSettingFormData>({
    resolver: zodResolver(rewardPointSettingSchema),
    defaultValues: {
      is_active: false,
      per_point_amount: null,
      minimum_amount: null,
      duration: null,
      type: null,
      redeem_amount_per_unit_rp: null,
      min_order_total_for_redeem: null,
      min_redeem_point: null,
      max_redeem_point: null,
    },
  })

  useEffect(() => {
    if (!setting) return
    const type = setting.type === 'days' || setting.type === 'months' || setting.type === 'years'
      ? setting.type
      : null
    form.reset({
      is_active: setting.is_active ?? false,
      per_point_amount: setting.per_point_amount ?? null,
      minimum_amount: setting.minimum_amount ?? null,
      duration: setting.duration ?? null,
      type,
      redeem_amount_per_unit_rp: setting.redeem_amount_per_unit_rp ?? null,
      min_order_total_for_redeem: setting.min_order_total_for_redeem ?? null,
      min_redeem_point: setting.min_redeem_point ?? null,
      max_redeem_point: setting.max_redeem_point ?? null,
    })
  }, [setting, form])

  const onSubmit = (data: RewardPointSettingFormData) => {
    updateSetting(data)
  }

  useEffect(() => {
    if (isError && error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load reward point setting')
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
          <h2 className="text-2xl font-bold tracking-tight">Reward Point Setting</h2>
          <p className="text-muted-foreground">
            Configure how customers earn and redeem reward points.
          </p>
        </div>

        <RewardPointSettingForm
          form={form}
          onSubmit={onSubmit}
          id="reward-point-setting-form"
          isPending={isPending}
        />
      </Main>
    </AuthenticatedLayout>
  )
}
