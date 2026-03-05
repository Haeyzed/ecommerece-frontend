'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { toast } from 'sonner'

import { useApiClient } from '@/lib/api/api-client-client'
import { ValidationError } from '@/lib/api/api-errors'

import type {
  EmploymentType,
  EmploymentTypeExportParams,
  EmploymentTypeFormBody,
  EmploymentTypeListParams,
  EmploymentTypeOption,
} from './types'

export const employmentTypeKeys = {
  all: ['employment-types'] as const,
  lists: () => [...employmentTypeKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...employmentTypeKeys.lists(), filters] as const,
  details: () => [...employmentTypeKeys.all, 'detail'] as const,
  detail: (id: number) => [...employmentTypeKeys.details(), id] as const,
  options: () => [...employmentTypeKeys.all, 'options'] as const,
  template: () => [...employmentTypeKeys.all, 'template'] as const,
}

const BASE_PATH = '/employment-types'

export function usePaginatedEmploymentTypes(params?: EmploymentTypeListParams) {
  const { api, sessionStatus } = useApiClient()
  const query = useQuery({
    queryKey: employmentTypeKeys.list(params),
    queryFn: async () => {
      return await api.get<EmploymentType[]>(BASE_PATH, { params })
    },
    enabled: sessionStatus !== 'loading',
  })
  return {
    ...query,
    isSessionLoading: sessionStatus === 'loading',
  }
}

export function useOptionEmploymentTypes() {
  const { api, sessionStatus } = useApiClient()
  return useQuery({
    queryKey: employmentTypeKeys.options(),
    queryFn: async () => {
      const response = await api.get<EmploymentTypeOption[]>(
        `${BASE_PATH}/options`
      )
      return response.data ?? []
    },
    enabled: sessionStatus !== 'loading',
  })
}

export function useEmploymentType(id: number) {
  const { api, sessionStatus } = useApiClient()
  const query = useQuery({
    queryKey: employmentTypeKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<EmploymentType>(`${BASE_PATH}/${id}`)
      return response.data ?? null
    },
    enabled: !!id && sessionStatus !== 'loading',
  })
  return {
    ...query,
    isSessionLoading: sessionStatus === 'loading',
  }
}

export function useCreateEmploymentType() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: EmploymentTypeFormBody) => {
      const payload: Record<string, unknown> = {
        name: data.name,
      }

      if (data.is_active !== undefined && data.is_active !== null) {
        payload.is_active = data.is_active
      }

      const response = await api.post<{ data: EmploymentType }>(
        BASE_PATH,
        payload
      )
      if (!response.success) {
        if (response.errors)
          throw new ValidationError(response.message, response.errors)
        throw new Error(response.message)
      }
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: employmentTypeKeys.lists() })
      toast.success(response.message)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export function useUpdateEmploymentType() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number
      data: Partial<EmploymentTypeFormBody>
    }) => {
      const payload: Record<string, unknown> = {}

      if (data.name !== undefined) payload.name = data.name
      if (data.is_active !== undefined) payload.is_active = data.is_active

      const response = await api.put<{ data: EmploymentType }>(
        `${BASE_PATH}/${id}`,
        payload
      )
      if (!response.success) {
        if (response.errors)
          throw new ValidationError(response.message, response.errors)
        throw new Error(response.message)
      }
      return { id, message: response.message }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: employmentTypeKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: employmentTypeKeys.detail(data.id),
      })
      toast.success(data.message)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export function useDeleteEmploymentType() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`${BASE_PATH}/${id}`)
      if (!response.success) throw new Error(response.message)
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: employmentTypeKeys.lists() })
      toast.success(response.message)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export function useBulkActivateEmploymentTypes() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.post<{ activated_count: number }>(
        `${BASE_PATH}/bulk-activate`,
        { ids }
      )
      if (!response.success) throw new Error(response.message)
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: employmentTypeKeys.lists() })
      toast.success(response.message)
    },
    onError: (error) => toast.error(error.message),
  })
}

export function useBulkDeactivateEmploymentTypes() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.post<{ deactivated_count: number }>(
        `${BASE_PATH}/bulk-deactivate`,
        { ids }
      )
      if (!response.success) throw new Error(response.message)
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: employmentTypeKeys.lists() })
      toast.success(response.message)
    },
    onError: (error) => toast.error(error.message),
  })
}

export function useBulkDestroyEmploymentTypes() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.post(`${BASE_PATH}/bulk-destroy`, { ids })
      if (!response.success) throw new Error(response.message)
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: employmentTypeKeys.lists() })
      toast.success(response.message)
    },
    onError: (error) => toast.error(error.message),
  })
}

export function useEmploymentTypesImport() {
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
      queryClient.invalidateQueries({ queryKey: employmentTypeKeys.lists() })
      toast.success(response.message)
    },
    onError: (error) => toast.error(error.message),
  })
}

export function useEmploymentTypesExport() {
  const { api } = useApiClient()

  return useMutation({
    mutationFn: async (params: EmploymentTypeExportParams) => {
      if (params.method === 'download') {
        const blob = await api.postBlob(`${BASE_PATH}/export`, params)
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `employment-types-export-${Date.now()}.${params.format === 'pdf' ? 'pdf' : 'xlsx'}`
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

export function useEmploymentTypesTemplateDownload() {
  const { api } = useApiClient()

  return useMutation({
    mutationFn: async () => {
      const blob = await api.getBlob(`${BASE_PATH}/download`)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `employment-types-sample.csv`
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
