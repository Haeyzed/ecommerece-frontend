'use client';

import { useApiClient } from '@/lib/api/api-client-client'
import { ValidationError } from '@/lib/api/api-errors'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type {
  Designation,
  DesignationExportParams,
  DesignationFormBody,
  DesignationListParams,
  DesignationOption,
} from './types'

export const designationKeys = {
  all: ['designations'] as const,
  lists: () => [...designationKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...designationKeys.lists(), filters] as const,
  details: () => [...designationKeys.all, 'detail'] as const,
  detail: (id: number) => [...designationKeys.details(), id] as const,
  options: () => [...designationKeys.all, 'options'] as const,
  template: () => [...designationKeys.all, 'template'] as const,
};

const BASE_PATH = '/designations';

// ==============================================================================
// QUERIES (READ)
// ==============================================================================

export function usePaginatedDesignations(params?: DesignationListParams) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: designationKeys.list(params),
    queryFn: async () => {
      return await api.get<Designation[]>(BASE_PATH, { params });
    },
    enabled: sessionStatus !== 'loading',
  });
  return {
    ...query,
    isSessionLoading: sessionStatus === 'loading',
  };
}

export function useOptionDesignations() {
  const { api, sessionStatus } = useApiClient();
  return useQuery({
    queryKey: designationKeys.options(),
    queryFn: async () => {
      const response = await api.get<DesignationOption[]>(`${BASE_PATH}/options`);
      return response.data ?? [];
    },
    enabled: sessionStatus !== 'loading',
  });
}

export function useDesignation(id: number) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: designationKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<Designation>(`${BASE_PATH}/${id}`);
      return response.data ?? null;
    },
    enabled: !!id && sessionStatus !== 'loading',
  });
  return {
    ...query,
    isSessionLoading: sessionStatus === 'loading',
  };
}

// ==============================================================================
// MUTATIONS (CREATE, UPDATE, DELETE)
// ==============================================================================

export function useCreateDesignation() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DesignationFormBody) => {
      const payload: Record<string, unknown> = {
        name: data.name,
      };
      if (data.is_active !== undefined && data.is_active !== null) payload.is_active = data.is_active;

      const response = await api.post<{ data: Designation }>(BASE_PATH, payload);
      if (!response.success) {
        if (response.errors) throw new ValidationError(response.message, response.errors);
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: designationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: designationKeys.options() });
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateDesignation() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<DesignationFormBody> }) => {
      const payload: Record<string, unknown> = {};
      if (data.name !== undefined) payload.name = data.name;
      if (data.is_active !== undefined) payload.is_active = data.is_active;

      const response = await api.put<{ data: Designation }>(`${BASE_PATH}/${id}`, payload);
      if (!response.success) {
        if (response.errors) throw new ValidationError(response.message, response.errors);
        throw new Error(response.message);
      }
      return { id, message: response.message };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: designationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: designationKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: designationKeys.options() });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteDesignation() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`${BASE_PATH}/${id}`);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: designationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: designationKeys.options() });
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

// ==============================================================================
// BULK MUTATIONS
// ==============================================================================

export function useBulkActivateDesignations() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.post<{ activated_count: number }>(
        `${BASE_PATH}/bulk-activate`,
        { ids }
      );
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: designationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: designationKeys.options() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useBulkDeactivateDesignations() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.post<{ deactivated_count: number }>(
        `${BASE_PATH}/bulk-deactivate`,
        { ids }
      );
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: designationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: designationKeys.options() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useBulkDestroyDesignations() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.post(`${BASE_PATH}/bulk-destroy`, { ids });
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: designationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: designationKeys.options() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

// ==============================================================================
// IMPORT & EXPORT
// ==============================================================================

export function useDesignationsImport() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.append('file', file);
      const response = await api.post(`${BASE_PATH}/import`, form);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: designationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: designationKeys.options() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useDesignationsExport() {
  const { api } = useApiClient();

  return useMutation({
    mutationFn: async (params: DesignationExportParams) => {
      if (params.method === 'download') {
        const blob = await api.postBlob(`${BASE_PATH}/export`, params);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `designations-export-${Date.now()}.${params.format === 'pdf' ? 'pdf' : 'xlsx'}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        return { message: "Export downloaded successfully" };
      }

      const response = await api.post(`${BASE_PATH}/export`, params);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useDesignationsTemplateDownload() {
  const { api } = useApiClient();

  return useMutation({
    mutationFn: async () => {
      const blob = await api.getBlob(`${BASE_PATH}/download`);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `designations-sample.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return { message: "Sample template downloaded" };
    },
    onSuccess: (response) => {
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}