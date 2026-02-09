'use client'

/**
 * General Settings API Hooks
 *
 * Client-side hooks for fetching and updating general settings.
 *
 * @module features/settings/general/api
 */

import { useApiClient } from '@/lib/api/api-client-client'
import { ValidationError } from '@/lib/api/api-errors'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { GeneralSetting } from './types'
import type { GeneralSettingFormData } from './schemas'

export const generalSettingKeys = {
  all: ['general-setting'] as const,
  detail: () => [...generalSettingKeys.all, 'detail'] as const,
}

export function useGeneralSetting() {
  const { api, sessionStatus } = useApiClient()
  const query = useQuery({
    queryKey: generalSettingKeys.detail(),
    queryFn: async () => {
      const response = await api.get<GeneralSetting>('/settings/general')
      return response.data ?? null
    },
    enabled: sessionStatus !== 'loading',
  })
  return {
    ...query,
    isSessionLoading: sessionStatus === 'loading',
  }
}

export function useUpdateGeneralSetting() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: GeneralSettingFormData) => {
      const formData = new FormData()
      formData.append('_method', 'PUT')
      formData.append('site_title', data.site_title)
      if (data.site_logo?.[0]) formData.append('site_logo', data.site_logo[0])
      if (data.favicon?.[0]) formData.append('favicon', data.favicon[0])
      if (data.is_rtl !== undefined) formData.append('is_rtl', data.is_rtl ? '1' : '0')
      if (data.is_zatca !== undefined) formData.append('is_zatca', data.is_zatca ? '1' : '0')
      if (data.company_name != null) formData.append('company_name', data.company_name)
      if (data.vat_registration_number != null) formData.append('vat_registration_number', data.vat_registration_number)
      if (data.currency != null) formData.append('currency', data.currency)
      if (data.currency_position != null) formData.append('currency_position', data.currency_position)
      if (data.decimal != null) formData.append('decimal', String(data.decimal))
      if (data.staff_access != null) formData.append('staff_access', data.staff_access)
      if (data.without_stock != null) formData.append('without_stock', data.without_stock)
      if (data.is_packing_slip !== undefined) formData.append('is_packing_slip', data.is_packing_slip ? '1' : '0')
      if (data.date_format != null) formData.append('date_format', data.date_format)
      if (data.developed_by != null) formData.append('developed_by', data.developed_by)
      if (data.invoice_format != null) formData.append('invoice_format', data.invoice_format)
      if (data.state != null) formData.append('state', String(data.state))
      if (data.default_margin_value != null) formData.append('default_margin_value', String(data.default_margin_value))
      if (data.font_css != null) formData.append('font_css', data.font_css)
      if (data.pos_css != null) formData.append('pos_css', data.pos_css)
      if (data.auth_css != null) formData.append('auth_css', data.auth_css)
      if (data.custom_css != null) formData.append('custom_css', data.custom_css)
      if (data.expiry_alert_days != null) formData.append('expiry_alert_days', String(data.expiry_alert_days))
      if (data.disable_signup !== undefined) formData.append('disable_signup', data.disable_signup ? '1' : '0')
      if (data.disable_forgot_password !== undefined) formData.append('disable_forgot_password', data.disable_forgot_password ? '1' : '0')
      if (data.maintenance_allowed_ips != null) formData.append('maintenance_allowed_ips', data.maintenance_allowed_ips)
      if (data.margin_type != null) formData.append('margin_type', String(data.margin_type))
      if (data.timezone != null) formData.append('timezone', data.timezone)
      if (data.show_products_details_in_sales_table !== undefined) formData.append('show_products_details_in_sales_table', data.show_products_details_in_sales_table ? '1' : '0')
      if (data.show_products_details_in_purchase_table !== undefined) formData.append('show_products_details_in_purchase_table', data.show_products_details_in_purchase_table ? '1' : '0')

      const response = await api.post<GeneralSetting>('/settings/general', formData)
      if (!response.success || !response.data) {
        if (response.errors) throw new ValidationError(response.message, response.errors)
        throw new Error(response.message)
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: generalSettingKeys.detail() })
      toast.success('General setting updated successfully')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to update general setting')
    },
  })
}
