'use client';

import { useApiClient } from '@/lib/api/api-client-client'
import { ValidationError } from '@/lib/api/api-errors'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type {
  LeaveType,
  LeaveTypeExportParams,
  LeaveTypeFormBody,
  LeaveTypeListParams,
  LeaveTypeOption,
} from './types'

export const leaveTypeKeys = {
  all: ['leave-types'] as const,
  lists: () => [...leaveTypeKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...leaveTypeKeys.lists(), filters] as const,
  details: () => [...leaveTypeKeys.all, 'detail'] as const,
  detail: (id: number) => [...leaveTypeKeys.details(), id] as const,
  options: () => [...leaveTypeKeys.all, 'options'] as const,
  template: () => [...leaveTypeKeys.all, 'template'] as const,
};

const BASE_PATH = '/leave-types';

// ==============================================================================
// QUERIES (READ)
// ==============================================================================

export function usePaginatedLeaveTypes(params?: LeaveTypeListParams) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: leaveTypeKeys.list(params),
    queryFn: async () => {
      return await api.get<LeaveType[]>(BASE_PATH, { params });
    },
    enabled: sessionStatus !== 'loading',
  });
  return {
    ...query,
    isSessionLoading: sessionStatus === 'loading',
  };
}

export function useOptionLeaveTypes() {
  const { api, sessionStatus } = useApiClient();
  return useQuery({
    queryKey: leaveTypeKeys.options(),
    queryFn: async () => {
      const response = await api.get<LeaveTypeOption[]>(`${BASE_PATH}/options`);
      return response.data ?? [];
    },
    enabled: sessionStatus !== 'loading',
  });
}

export function useLeaveType(id: number) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: leaveTypeKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<LeaveType>(`${BASE_PATH}/${id}`);
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

export function useCreateLeaveType() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LeaveTypeFormBody) => {
      const payload: Record<string, unknown> = {
        name: data.name,
        annual_quota: data.annual_quota,
        encashable: data.encashable,
        carry_forward_limit: data.carry_forward_limit,
      };

      if (data.is_active !== undefined && data.is_active !== null) {
        payload.is_active = data.is_active;
      }

      const response = await api.post<{ data: LeaveType }>(BASE_PATH, payload);
      if (!response.success) {
        if (response.errors) throw new ValidationError(response.message, response.errors);
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: leaveTypeKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateLeaveType() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<LeaveTypeFormBody> }) => {
      const payload: Record<string, unknown> = {};

      if (data.name !== undefined) payload.name = data.name;
      if (data.annual_quota !== undefined) payload.annual_quota = data.annual_quota;
      if (data.encashable !== undefined) payload.encashable = data.encashable;
      if (data.carry_forward_limit !== undefined) payload.carry_forward_limit = data.carry_forward_limit;
      if (data.is_active !== undefined) payload.is_active = data.is_active;

      const response = await api.put<{ data: LeaveType }>(`${BASE_PATH}/${id}`, payload);
      if (!response.success) {
        if (response.errors) throw new ValidationError(response.message, response.errors);
        throw new Error(response.message);
      }
      return { id, message: response.message };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: leaveTypeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: leaveTypeKeys.detail(data.id) });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteLeaveType() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`${BASE_PATH}/${id}`);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: leaveTypeKeys.lists() });
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

export function useBulkActivateLeaveTypes() {
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
      queryClient.invalidateQueries({ queryKey: leaveTypeKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useBulkDeactivateLeaveTypes() {
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
      queryClient.invalidateQueries({ queryKey: leaveTypeKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useBulkDestroyLeaveTypes() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.post(`${BASE_PATH}/bulk-destroy`, { ids });
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: leaveTypeKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

// ==============================================================================
// IMPORT & EXPORT
// ==============================================================================

export function useLeaveTypesImport() {
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
      queryClient.invalidateQueries({ queryKey: leaveTypeKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useLeaveTypesExport() {
  const { api } = useApiClient();

  return useMutation({
    mutationFn: async (params: LeaveTypeExportParams) => {
      if (params.method === 'download') {
        const blob = await api.postBlob(`${BASE_PATH}/export`, params);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `leave-types-export-${Date.now()}.${params.format === 'pdf' ? 'pdf' : 'xlsx'}`;
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

export function useLeaveTypesTemplateDownload() {
  const { api } = useApiClient();

  return useMutation({
    mutationFn: async () => {
      const blob = await api.getBlob(`${BASE_PATH}/download`);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `leave-types-sample.csv`;
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