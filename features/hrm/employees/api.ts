'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { toast } from 'sonner'

import { useApiClient } from '@/lib/api/api-client-client'
import { ValidationError } from '@/lib/api/api-errors'

import type { EmployeeFormData } from './schemas'
import type {
  Employee,
  EmployeeExportParams,
  EmployeeListParams,
  EmployeeOption,
} from './types'

export const employeeKeys = {
  all: ['employees'] as const,
  lists: () => [...employeeKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...employeeKeys.lists(), filters] as const,
  details: () => [...employeeKeys.all, 'detail'] as const,
  detail: (id: number) => [...employeeKeys.details(), id] as const,
  options: () => [...employeeKeys.all, 'options'] as const,
  template: () => [...employeeKeys.all, 'template'] as const,
}

const BASE_PATH = '/employees'

function buildEmployeeFormData(
  data: EmployeeFormData,
  isUpdate = false
): FormData {
  const formData = new FormData()

  if (isUpdate) formData.append('_method', 'PUT')

  const rootFields = [
    'name',
    'staff_id',
    'email',
    'phone_number',
    'address',
    'department_id',
    'designation_id',
    'shift_id',
    'basic_salary',
    'country_id',
    'state_id',
    'city_id',
    'is_active',
    'is_sale_agent',
    'sale_commission_percent',
    'onboarding_checklist_template_id',
  ] as const

  rootFields.forEach((key) => {
    if (data[key] !== undefined && data[key] !== null) {
      formData.append(key, String(data[key]))
    }
  })

  if (data.image && data.image[0] instanceof File) {
    formData.append('image', data.image[0])
  }

  // User object
  if (data.user) {
    if (data.user.username)
      formData.append('user[username]', data.user.username)
    if (data.user.password)
      formData.append('user[password]', data.user.password)
    data.user.roles?.forEach((r, i) =>
      formData.append(`user[roles][${i}]`, r.toString())
    )
    data.user.permissions?.forEach((p, i) =>
      formData.append(`user[permissions][${i}]`, p.toString())
    )
  }

  // Profile object
  if (data.profile) {
    const profileFields = [
      'date_of_birth',
      'gender',
      'marital_status',
      'national_id',
      'tax_number',
      'bank_name',
      'account_number',
    ] as const
    profileFields.forEach((key) => {
      if (data.profile![key])
        formData.append(`profile[${key}]`, data.profile![key] as string)
    })
  }

  // Sales Targets
  data.sales_target?.forEach((st, i) => {
    formData.append(`sales_target[${i}][sales_from]`, st.sales_from.toString())
    formData.append(`sales_target[${i}][sales_to]`, st.sales_to.toString())
    formData.append(`sales_target[${i}][percent]`, st.percent.toString())
  })

  // Documents
  data.documents?.forEach((doc, i) => {
    if (doc.id) formData.append(`documents[${i}][id]`, doc.id.toString())
    formData.append(
      `documents[${i}][document_type_id]`,
      doc.document_type_id.toString()
    )
    if (doc.name) formData.append(`documents[${i}][name]`, doc.name)
    if (doc.notes) formData.append(`documents[${i}][notes]`, doc.notes)
    if (doc.issue_date)
      formData.append(`documents[${i}][issue_date]`, doc.issue_date)
    if (doc.expiry_date)
      formData.append(`documents[${i}][expiry_date]`, doc.expiry_date)

    if (doc.file && doc.file[0] instanceof File) {
      formData.append(`documents[${i}][file]`, doc.file[0])
    }
  })

  return formData
}

export function usePaginatedEmployees(params?: EmployeeListParams) {
  const { api, sessionStatus } = useApiClient()
  const query = useQuery({
    queryKey: employeeKeys.list(params),
    queryFn: async () => {
      return await api.get<Employee[]>(BASE_PATH, { params })
    },
    enabled: sessionStatus !== 'loading',
  })
  return { ...query, isSessionLoading: sessionStatus === 'loading' }
}

export function useOptionEmployees() {
  const { api, sessionStatus } = useApiClient()
  return useQuery({
    queryKey: employeeKeys.options(),
    queryFn: async () => {
      const response = await api.get<EmployeeOption[]>(`${BASE_PATH}/options`)
      return response.data ?? []
    },
    enabled: sessionStatus !== 'loading',
  })
}

export function useEmployee(id: number) {
  const { api, sessionStatus } = useApiClient()
  return useQuery({
    queryKey: employeeKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<Employee>(`${BASE_PATH}/${id}`)
      return response.data ?? null
    },
    enabled: !!id && sessionStatus !== 'loading',
  })
}

export function useCreateEmployee() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: EmployeeFormData) => {
      const formData = buildEmployeeFormData(data, false)
      const response = await api.post<{ data: Employee }>(BASE_PATH, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (!response.success) {
        if (response.errors)
          throw new ValidationError(response.message, response.errors)
        throw new Error(response.message)
      }
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() })
      toast.success(response.message)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export function useUpdateEmployee() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number
      data: Partial<EmployeeFormData>
    }) => {
      const formData = buildEmployeeFormData(data as EmployeeFormData, true)
      const response = await api.post<{ data: Employee }>(
        `${BASE_PATH}/${id}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      )
      if (!response.success) {
        if (response.errors)
          throw new ValidationError(response.message, response.errors)
        throw new Error(response.message)
      }
      return { id, message: response.message }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() })
      queryClient.invalidateQueries({ queryKey: employeeKeys.detail(data.id) })
      toast.success(data.message)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export function useDeleteEmployee() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`${BASE_PATH}/${id}`)
      if (!response.success) throw new Error(response.message)
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() })
      toast.success(response.message)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export function useBulkActivateEmployees() {
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
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() })
      toast.success(response.message)
    },
    onError: (error) => toast.error(error.message),
  })
}

export function useBulkDeactivateEmployees() {
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
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() })
      toast.success(response.message)
    },
    onError: (error) => toast.error(error.message),
  })
}

export function useBulkDestroyEmployees() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.post(`${BASE_PATH}/bulk-destroy`, { ids })
      if (!response.success) throw new Error(response.message)
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() })
      toast.success(response.message)
    },
    onError: (error) => toast.error(error.message),
  })
}

export function useEmployeesImport() {
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
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() })
      toast.success(response.message)
    },
    onError: (error) => toast.error(error.message),
  })
}

export function useEmployeesExport() {
  const { api } = useApiClient()

  return useMutation({
    mutationFn: async (params: EmployeeExportParams) => {
      if (params.method === 'download') {
        const blob = await api.postBlob(`${BASE_PATH}/export`, params)
        const url = window.URL.createObjectURL(blob)
        const fileName = `employees-export-${Date.now()}.${params.format === 'pdf' ? 'pdf' : 'xlsx'}`
        const link = document.createElement('a')
        link.href = url
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

export function useEmployeesTemplateDownload() {
  const { api } = useApiClient()
  return useMutation({
    mutationFn: async () => {
      const blob = await api.getBlob(`${BASE_PATH}/download`)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `employees-sample.csv`
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
