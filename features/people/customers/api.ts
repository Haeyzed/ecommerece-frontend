'use client'

/**
 * Customers API hooks
 *
 * Client-side hooks for Customer CRUD, list, bulk actions, import/export.
 * Uses TanStack Query and NextAuth-aware API client.
 */

import { useApiClient } from '@/lib/api/api-client-client'
import { ValidationError } from '@/lib/api/api-errors'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { Customer, CustomerDeposit, CustomerFormData } from './types'

export const customerKeys = {
  all: ['customers'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...customerKeys.lists(), filters] as const,
  details: () => [...customerKeys.all, 'detail'] as const,
  detail: (id: number) => [...customerKeys.details(), id] as const,
  deposits: (customerId: number) =>
    [...customerKeys.detail(customerId), 'deposits'] as const,
}

export function useCustomers(params?: {
  page?: number
  per_page?: number
  search?: string
  status?: string
  customer_group_id?: number
}) {
  const { api, sessionStatus } = useApiClient()
  const query = useQuery({
    queryKey: customerKeys.list(params),
    queryFn: async () => {
      const response = await api.get<Customer[]>('/customers', { params })
      return response
    },
    enabled: sessionStatus !== 'loading',
  })
  return {
    ...query,
    isSessionLoading: sessionStatus === 'loading',
  }
}

export function useCustomer(id: number) {
  const { api, sessionStatus } = useApiClient()
  const query = useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<Customer>(`/customers/${id}`)
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
        `/customers/${customerId}/deposits`
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
        `/customers/${customerId}/deposits`,
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

export function useCustomerGroupsActive() {
  const { api, sessionStatus } = useApiClient()
  return useQuery({
    queryKey: ['customer-groups', 'active'] as const,
    queryFn: async () => {
      const response = await api.get<{ id: number; name: string }[]>(
        '/customer-groups/all/active'
      )
      return response.data ?? []
    },
    enabled: sessionStatus !== 'loading',
  })
}

export function useCreateCustomer() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CustomerFormData) => {
      const response = await api.post<Customer>('/customers', data)
      if (!response.success || !response.data) {
        if (response.errors) {
          throw new ValidationError(response.message, response.errors)
        }
        throw new Error(response.message)
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() })
      toast.success('Customer created successfully')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to create customer')
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
      const response = await api.put<Customer>(`/customers/${id}`, data)
      if (!response.success || !response.data) {
        if (response.errors) {
          throw new ValidationError(response.message, response.errors)
        }
        throw new Error(response.message)
      }
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() })
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(variables.id) })
      toast.success('Customer updated successfully')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to update customer')
    },
  })
}

export function useDeleteCustomer() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/customers/${id}`)
      if (!response.success) throw new Error(response.message)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() })
      toast.success('Customer deleted successfully')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to delete customer')
    },
  })
}

export function useBulkDestroyCustomers() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.delete('/customers/bulk-destroy', {
        body: JSON.stringify({ ids }),
      })
      if (!response.success) throw new Error(response.message)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() })
      toast.success('Customers deleted')
    },
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : 'Failed to delete customers'),
  })
}

export function useCustomersImport() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData()
      form.append('file', file)
      const response = await api.post('/customers/import', form)
      if (!response.success) throw new Error(response.message)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() })
      toast.success('Customers imported')
    },
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : 'Import failed'),
  })
}

export type CustomerExportParams = {
  ids?: number[]
  format: 'excel' | 'pdf'
  method: 'download' | 'email'
  columns: string[]
  user_id?: number
}

export function useCustomersExport() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: CustomerExportParams) => {
      if (params.method === 'download') {
        const blob = await api.postBlob('/customers/export', params)
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        const fileName = `customers-export-${Date.now()}.${params.format === 'pdf' ? 'pdf' : 'xlsx'}`
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        return { message: 'Export downloaded' }
      }
      const response = await api.post('/customers/export', params)
      if (!response.success) throw new Error(response.message)
      return response
    },
    onSuccess: (_, variables) => {
      if (variables.method === 'email') {
        toast.success('Export sent via email')
      } else {
        toast.success('Export downloaded')
      }
    },
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : 'Export failed'),
  })
}
