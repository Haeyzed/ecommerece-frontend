'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { toast } from 'sonner'

import { useApiClient } from '@/lib/api/api-client-client'
import { ValidationError } from '@/lib/api/api-errors'

import type {
  DocumentType,
  DocumentTypeExportParams,
  DocumentTypeFormBody,
  DocumentTypeListParams,
  DocumentTypeOption,
} from './types'

export const documentTypeKeys = {
  all: ['document-types'] as const,
  lists: () => [...documentTypeKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...documentTypeKeys.lists(), filters] as const,
  details: () => [...documentTypeKeys.all, 'detail'] as const,
  detail: (id: number) => [...documentTypeKeys.details(), id] as const,
  options: () => [...documentTypeKeys.all, 'options'] as const,
  template: () => [...documentTypeKeys.all, 'template'] as const,
}

const BASE_PATH = '/document-types'

export function usePaginatedDocumentTypes(params?: DocumentTypeListParams) {
  const { api, sessionStatus } = useApiClient()
  const query = useQuery({
    queryKey: documentTypeKeys.list(params),
    queryFn: async () => {
      return await api.get<DocumentType[]>(BASE_PATH, { params })
    },
    enabled: sessionStatus !== 'loading',
  })
  return {
    ...query,
    isSessionLoading: sessionStatus === 'loading',
  }
}

export function useOptionDocumentTypes() {
  const { api, sessionStatus } = useApiClient()
  return useQuery({
    queryKey: documentTypeKeys.options(),
    queryFn: async () => {
      const response = await api.get<DocumentTypeOption[]>(
        `${BASE_PATH}/options`
      )
      return response.data ?? []
    },
    enabled: sessionStatus !== 'loading',
  })
}

export function useDocumentType(id: number) {
  const { api, sessionStatus } = useApiClient()
  const query = useQuery({
    queryKey: documentTypeKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<DocumentType>(`${BASE_PATH}/${id}`)
      return response.data ?? null
    },
    enabled: !!id && sessionStatus !== 'loading',
  })
  return {
    ...query,
    isSessionLoading: sessionStatus === 'loading',
  }
}

export function useCreateDocumentType() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: DocumentTypeFormBody) => {
      const payload: Record<string, unknown> = {
        name: data.name,
        code: data.code,
        requires_expiry: data.requires_expiry,
      }

      if (data.is_active !== undefined && data.is_active !== null) {
        payload.is_active = data.is_active
      }

      const response = await api.post<{ data: DocumentType }>(
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
      queryClient.invalidateQueries({ queryKey: documentTypeKeys.lists() })
      toast.success(response.message)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export function useUpdateDocumentType() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number
      data: Partial<DocumentTypeFormBody>
    }) => {
      const payload: Record<string, unknown> = {}

      if (data.name !== undefined) payload.name = data.name
      if (data.code !== undefined) payload.code = data.code
      if (data.requires_expiry !== undefined)
        payload.requires_expiry = data.requires_expiry
      if (data.is_active !== undefined) payload.is_active = data.is_active

      const response = await api.put<{ data: DocumentType }>(
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
      queryClient.invalidateQueries({ queryKey: documentTypeKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: documentTypeKeys.detail(data.id),
      })
      toast.success(data.message)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export function useDeleteDocumentType() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`${BASE_PATH}/${id}`)
      if (!response.success) throw new Error(response.message)
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: documentTypeKeys.lists() })
      toast.success(response.message)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export function useBulkActivateDocumentTypes() {
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
      queryClient.invalidateQueries({ queryKey: documentTypeKeys.lists() })
      toast.success(response.message)
    },
    onError: (error) => toast.error(error.message),
  })
}

export function useBulkDeactivateDocumentTypes() {
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
      queryClient.invalidateQueries({ queryKey: documentTypeKeys.lists() })
      toast.success(response.message)
    },
    onError: (error) => toast.error(error.message),
  })
}

export function useBulkDestroyDocumentTypes() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.post(`${BASE_PATH}/bulk-destroy`, { ids })
      if (!response.success) throw new Error(response.message)
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: documentTypeKeys.lists() })
      toast.success(response.message)
    },
    onError: (error) => toast.error(error.message),
  })
}

export function useDocumentTypesImport() {
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
      queryClient.invalidateQueries({ queryKey: documentTypeKeys.lists() })
      toast.success(response.message)
    },
    onError: (error) => toast.error(error.message),
  })
}

export function useDocumentTypesExport() {
  const { api } = useApiClient()

  return useMutation({
    mutationFn: async (params: DocumentTypeExportParams) => {
      if (params.method === 'download') {
        const blob = await api.postBlob(`${BASE_PATH}/export`, params)
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `document-types-export-${Date.now()}.${params.format === 'pdf' ? 'pdf' : 'xlsx'}`
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

export function useDocumentTypesTemplateDownload() {
  const { api } = useApiClient()

  return useMutation({
    mutationFn: async () => {
      const blob = await api.getBlob(`${BASE_PATH}/download`)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `document-types-sample.csv`
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
