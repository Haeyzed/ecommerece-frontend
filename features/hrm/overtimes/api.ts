'use client';

import { useApiClient } from '@/lib/api/api-client-client'
import { ValidationError } from '@/lib/api/api-errors'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type {
  Overtime,
  OvertimeExportParams,
  OvertimeFormBody,
  OvertimeListParams,
} from './types'

export const overtimeKeys = {
  all: ['overtimes'] as const,
  lists: () => [...overtimeKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...overtimeKeys.lists(), filters] as const,
  details: () => [...overtimeKeys.all, 'detail'] as const,
  detail: (id: number) => [...overtimeKeys.details(), id] as const,
  template: () => [...overtimeKeys.all, 'template'] as const,
};

const BASE_PATH = '/overtimes';

export function usePaginatedOvertimes(params?: OvertimeListParams) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: overtimeKeys.list(params),
    queryFn: async () => {
      return await api.get<Overtime[]>(BASE_PATH, { params });
    },
    enabled: sessionStatus !== 'loading',
  });
  return {
    ...query,
    isSessionLoading: sessionStatus === 'loading',
  };
}

export function useOvertime(id: number) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: overtimeKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<Overtime>(`${BASE_PATH}/${id}`);
      return response.data ?? null;
    },
    enabled: !!id && sessionStatus !== 'loading',
  });
  return {
    ...query,
    isSessionLoading: sessionStatus === 'loading',
  };
}

export function useCreateOvertime() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: OvertimeFormBody) => {
      const payload: Record<string, unknown> = {
        employee_id: data.employee_id,
        date: data.date,
        hours: data.hours,
        rate: data.rate,
      };

      if (data.status !== undefined && data.status !== null) {
        payload.status = data.status;
      }

      const response = await api.post<{ data: Overtime }>(BASE_PATH, payload);
      if (!response.success) {
        if (response.errors) throw new ValidationError(response.message, response.errors);
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: overtimeKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateOvertime() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<OvertimeFormBody> }) => {
      const payload: Record<string, unknown> = {};

      if (data.employee_id !== undefined) payload.employee_id = data.employee_id;
      if (data.date !== undefined) payload.date = data.date;
      if (data.hours !== undefined) payload.hours = data.hours;
      if (data.rate !== undefined) payload.rate = data.rate;
      if (data.status !== undefined) payload.status = data.status;

      const response = await api.put<{ data: Overtime }>(`${BASE_PATH}/${id}`, payload);
      if (!response.success) {
        if (response.errors) throw new ValidationError(response.message, response.errors);
        throw new Error(response.message);
      }
      return { id, message: response.message };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: overtimeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: overtimeKeys.detail(data.id) });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteOvertime() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`${BASE_PATH}/${id}`);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: overtimeKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useBulkApproveOvertimes() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.post<{ approved_count: number }>(
        `${BASE_PATH}/bulk-approve`,
        { ids }
      );
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: overtimeKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useBulkRejectOvertimes() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.post<{ rejected_count: number }>(
        `${BASE_PATH}/bulk-reject`,
        { ids }
      );
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: overtimeKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useBulkDestroyOvertimes() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.post(`${BASE_PATH}/bulk-destroy`, { ids });
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: overtimeKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useOvertimesImport() {
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
      queryClient.invalidateQueries({ queryKey: overtimeKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useOvertimesExport() {
  const { api } = useApiClient();

  return useMutation({
    mutationFn: async (params: OvertimeExportParams) => {
      if (params.method === 'download') {
        const blob = await api.postBlob(`${BASE_PATH}/export`, params);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `overtimes-export-${Date.now()}.${params.format === 'pdf' ? 'pdf' : 'xlsx'}`;
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

export function useOvertimesTemplateDownload() {
  const { api } = useApiClient();

  return useMutation({
    mutationFn: async () => {
      const blob = await api.getBlob(`${BASE_PATH}/download`);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `overtimes-sample.csv`;
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