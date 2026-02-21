'use client'

import { useApiClient } from '@/lib/api/api-client-client'
import { ValidationError } from '@/lib/api/api-errors'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { CustomerFormData } from './schemas'
import type {
  Customer,
  CustomerDeposit,
  CustomerExportParams,
  CustomerListParams,
  CustomerOption,
} from './types'

export const customerKeys = {
  all: ['customers'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...customerKeys.lists(), filters] as const,
  details: () => [...customerKeys.all, 'detail'] as const,
  detail: (id: number) => [...customerKeys.details(), id] as const,
  options: () => [...customerKeys.all, 'options'] as const,
  template: () => [...customerKeys.all, 'template'] as const,
  deposits: (customerId: number) =>
    [...customerKeys.detail(customerId), 'deposits'] as const,
}

const BASE_PATH = '/customers'

export function useCustomers(params?: CustomerListParams) {
  const { api, sessionStatus } = useApiClient()
  const query = useQuery({
    queryKey: customerKeys.list(params),
    queryFn: async () => {
      const response = await api.get<Customer[]>(BASE_PATH, { params })
      return response
    },
    enabled: sessionStatus !== 'loading',
  })
  return {
    ...query,
    isSessionLoading: sessionStatus === 'loading',
  }
}

export function useOptionCustomers() {
  const { api, sessionStatus } = useApiClient()
  return useQuery({
    queryKey: customerKeys.options(),
    queryFn: async () => {
      const response = await api.get<CustomerOption[]>(`${BASE_PATH}/options`)
      return response.data ?? []
    },
    enabled: sessionStatus !== 'loading',
  })
}

export function useCustomer(id: number) {
  const { api, sessionStatus } = useApiClient()
  const query = useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<Customer>(`${BASE_PATH}/${id}`)
      return response.data ?? null
    },
    enabled: !!id && sessionStatus !== 'loading',
  })
  return {
    ...query,
    isSessionLoading: sessionStatus === 'loading',
  }
}

export function useCustomerDeposits(customerId: number) {
  const { api, sessionStatus } = useApiClient()
  return useQuery({
    queryKey: customerKeys.deposits(customerId),
    queryFn: async () => {
      const response = await api.get<CustomerDeposit[]>(
        `${BASE_PATH}/${customerId}/deposits`
      )
      return response.data ?? []
    },
    enabled: !!customerId && sessionStatus !== 'loading',
  })
}

export function useAddCustomerDeposit(customerId: number) {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: { amount: number; note?: string | null }) => {
      const response = await api.post<CustomerDeposit>(
        `${BASE_PATH}/${customerId}/deposits`,
        payload
      )
      if (!response.success || !response.data) {
        throw new Error(response.message ?? 'Failed to add deposit')
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: customerKeys.deposits(customerId),
      })
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: customerKeys.detail(customerId),
      })
      toast.success('Deposit added successfully')
    },
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : 'Failed to add deposit'),
  })
}

/** Uses customer-groups options endpoint; returns { id, name }[] for backward compatibility. */
export function useCustomerGroupsActive() {
  const { api, sessionStatus } = useApiClient()
  return useQuery({
    queryKey: ['customer-groups', 'options'] as const,
    queryFn: async () => {
      const response = await api.get<Array<{ value: number; label: string }>>(
        '/customer-groups/options'
      )
      const list = response.data ?? []
      return list.map((o) => ({ id: o.value, name: o.label }))
    },
    enabled: sessionStatus !== 'loading',
  })
}

export function useCreateCustomer() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CustomerFormData) => {
      const response = await api.post<{ data: Customer }>(BASE_PATH, data)
      if (!response.success) {
        if (response.errors) {
          throw new ValidationError(response.message, response.errors)
        }
        throw new Error(response.message)
      }
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() })
      toast.success(response.message)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export function useUpdateCustomer() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number
      data: Partial<CustomerFormData>
    }) => {
      const response = await api.put<{ data: Customer }>(`${BASE_PATH}/${id}`, data)
      if (!response.success) {
        if (response.errors) {
          throw new ValidationError(response.message, response.errors)
        }
        throw new Error(response.message)
      }
      return { id, message: response.message }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() })
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(data.id) })
      toast.success(data.message)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export function useDeleteCustomer() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`${BASE_PATH}/${id}`)
      if (!response.success) throw new Error(response.message)
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() })
      toast.success(response.message)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export function useBulkActivateCustomers() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.patch<{ activated_count: number }>(
        `${BASE_PATH}/bulk-activate`,
        { ids }
      )
      if (!response.success) throw new Error(response.message)
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() })
      toast.success(response.message)
    },
    onError: (error) => toast.error(error.message),
  })
}

export function useBulkDeactivateCustomers() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.patch<{ deactivated_count: number }>(
        `${BASE_PATH}/bulk-deactivate`,
        { ids }
      )
      if (!response.success) throw new Error(response.message)
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() })
      toast.success(response.message)
    },
    onError: (error) => toast.error(error.message),
  })
}

export function useBulkDestroyCustomers() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.post(`${BASE_PATH}/bulk-destroy`, { ids })
      if (!response.success) throw new Error(response.message)
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() })
      toast.success(response.message)
    },
    onError: (error) => toast.error(error.message),
  })
}

export function useCustomersImport() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData()
      form.append('file', file)
      const response = await api.post(`${BASE_PATH}/import`, form)
      if (!response.success) throw new Error(response.message)
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() })
      toast.success(response.message)
    },
    onError: (error) => toast.error(error.message),
  })
}

export function useCustomersExport() {
  const { api } = useApiClient()

  return useMutation({
    mutationFn: async (params: CustomerExportParams) => {
      if (params.method === 'download') {
        const blob = await api.postBlob(`${BASE_PATH}/export`, params)
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        const fileName = `customers-export-${Date.now()}.${params.format === 'pdf' ? 'pdf' : 'xlsx'}`
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        return { message: 'Export downloaded successfully' }
      }
      const response = await api.post(`${BASE_PATH}/export`, params)
      if (!response.success) throw new Error(response.message)
      return response
    },
    onSuccess: (response) => {
      toast.success(response.message)
    },
    onError: (error) => toast.error(error.message),
  })
}

export function useCustomersTemplateDownload() {
  const { api } = useApiClient()
  return useMutation({
    mutationFn: async () => {
      const blob = await api.getBlob(`${BASE_PATH}/download`)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'customers-sample.csv'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      return { message: 'Sample template downloaded' }
    },
    onSuccess: (response) => {
      toast.success(response.message)
    },
    onError: (error) => toast.error(error.message),
  })
}
