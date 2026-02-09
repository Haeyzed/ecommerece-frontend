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
import { useGeneralSetting, useUpdateGeneralSetting } from '@/features/settings/general/api'
import { generalSettingSchema, type GeneralSettingFormData } from '@/features/settings/general/schemas'
import { GeneralSettingForm } from './general-setting-form'

export function GeneralSettingClient() {
  const { data: setting, isLoading, isSessionLoading, error, isError } = useGeneralSetting()
  const { mutate: updateSetting, isPending } = useUpdateGeneralSetting()

  const form = useForm<GeneralSettingFormData>({
    resolver: zodResolver(generalSettingSchema),
    defaultValues: {
      site_title: '',
      is_rtl: false,
      is_zatca: false,
      company_name: null,
      vat_registration_number: null,
      currency: null,
      currency_position: 'prefix',
      decimal: 2,
      staff_access: 'all',
      without_stock: 'no',
      is_packing_slip: false,
      date_format: 'Y-m-d',
      developed_by: null,
      invoice_format: 'standard',
      state: null,
      default_margin_value: null,
      font_css: null,
      pos_css: null,
      auth_css: null,
      custom_css: null,
      expiry_alert_days: 0,
      disable_signup: false,
      disable_forgot_password: false,
      maintenance_allowed_ips: null,
      margin_type: 0,
      timezone: null,
      show_products_details_in_sales_table: false,
      show_products_details_in_purchase_table: false,
    },
  })

  useEffect(() => {
    if (!setting) return
    form.reset({
      site_title: setting.site_title ?? '',
      site_logo: undefined,
      favicon: undefined,
      is_rtl: setting.is_rtl ?? false,
      is_zatca: setting.is_zatca ?? false,
      company_name: setting.company_name ?? null,
      vat_registration_number: setting.vat_registration_number ?? null,
      currency: setting.currency ?? null,
      currency_position: (setting.currency_position === 'suffix' ? 'suffix' : 'prefix') as 'prefix' | 'suffix',
      decimal: setting.decimal ?? 2,
      staff_access: (setting.staff_access === 'own' ? 'own' : setting.staff_access === 'warehouse' ? 'warehouse' : 'all') as 'all' | 'own' | 'warehouse',
      without_stock: (setting.without_stock === 'yes' ? 'yes' : 'no') as 'yes' | 'no',
      is_packing_slip: setting.is_packing_slip ?? false,
      date_format: setting.date_format ?? 'Y-m-d',
      developed_by: setting.developed_by ?? null,
      invoice_format: (setting.invoice_format === 'gst' ? 'gst' : 'standard') as 'standard' | 'gst',
      state: (setting.state === 1 || setting.state === 2 ? setting.state : null) as 1 | 2 | null,
      default_margin_value: setting.default_margin_value ?? null,
      font_css: setting.font_css ?? null,
      pos_css: setting.pos_css ?? null,
      auth_css: setting.auth_css ?? null,
      custom_css: setting.custom_css ?? null,
      expiry_alert_days: setting.expiry_alert_days ?? 0,
      disable_signup: setting.disable_signup ?? false,
      disable_forgot_password: setting.disable_forgot_password ?? false,
      maintenance_allowed_ips: setting.maintenance_allowed_ips ?? null,
      margin_type: (setting.margin_type === 1 ? 1 : 0) as 0 | 1,
      timezone: setting.timezone ?? null,
      show_products_details_in_sales_table: setting.show_products_details_in_sales_table ?? false,
      show_products_details_in_purchase_table: setting.show_products_details_in_purchase_table ?? false,
    })
  }, [setting, form])

  const onSubmit = (data: GeneralSettingFormData) => {
    updateSetting(data)
  }

  useEffect(() => {
    if (isError && error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load general setting')
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
          <h2 className="text-2xl font-bold tracking-tight">General Setting</h2>
          <p className="text-muted-foreground">
            Configure system title, company details, locale, and appearance.
          </p>
        </div>

        <GeneralSettingForm
          form={form}
          onSubmit={onSubmit}
          id="general-setting-form"
          isPending={isPending}
          setting={setting ?? undefined}
        />
      </Main>
    </AuthenticatedLayout>
  )
}
