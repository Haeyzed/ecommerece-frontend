'use client';

import { useApiClient } from '@/lib/api/api-client-client'
import { ValidationError } from '@/lib/api/api-errors'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type {
  Holiday,
  HolidayExportParams,
  HolidayFormBody,
  HolidayListParams,
  HolidayOption,
} from './types'

export const holidayKeys = {
  all: ['holidays'] as const,
  lists: () => [...holidayKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...holidayKeys.lists(), filters] as const,
  details: () => [...holidayKeys.all, 'detail'] as const,
  detail: (id: number) => [...holidayKeys.details(), id] as const,
  options: () => [...holidayKeys.all, 'options'] as const,
  template: () => [...holidayKeys.all, 'template'] as const,
};

const BASE_PATH = '/holidays';

// ==============================================================================
// QUERIES (READ)
// ==============================================================================

export function usePaginatedHolidays(params?: HolidayListParams) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: holidayKeys.list(params),
    queryFn: async () => {
      return await api.get<Holiday[]>(BASE_PATH, { params });
    },
    enabled: sessionStatus !== 'loading',
  });
  return {
    ...query,
    isSessionLoading: sessionStatus === 'loading',
  };
}

export function useOptionHolidays() {
  const { api, sessionStatus } = useApiClient();
  return useQuery({
    queryKey: holidayKeys.options(),
    queryFn: async () => {
      const response = await api.get<HolidayOption[]>(`${BASE_PATH}/options`);
      return response.data ?? [];
    },
    enabled: sessionStatus !== 'loading',
  });
}

export function useHoliday(id: number) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: holidayKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<Holiday>(`${BASE_PATH}/${id}`);
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

export function useCreateHoliday() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: HolidayFormBody) => {
      const payload: Record<string, unknown> = {
        from_date: data.from_date,
        to_date: data.to_date,
      };

      if (data.note !== undefined) payload.note = data.note;
      if (data.region !== undefined) payload.region = data.region;
      if (data.recurring !== undefined && data.recurring !== null) payload.recurring = data.recurring;
      if (data.is_approved !== undefined && data.is_approved !== null) payload.is_approved = data.is_approved;

      const response = await api.post<{ data: Holiday }>(BASE_PATH, payload);
      if (!response.success) {
        if (response.errors) throw new ValidationError(response.message, response.errors);
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: holidayKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateHoliday() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<HolidayFormBody> }) => {
      const payload: Record<string, unknown> = {};

      if (data.from_date !== undefined) payload.from_date = data.from_date;
      if (data.to_date !== undefined) payload.to_date = data.to_date;
      if (data.note !== undefined) payload.note = data.note;
      if (data.region !== undefined) payload.region = data.region;
      if (data.recurring !== undefined) payload.recurring = data.recurring;
      if (data.is_approved !== undefined) payload.is_approved = data.is_approved;

      const response = await api.put<{ data: Holiday }>(`${BASE_PATH}/${id}`, payload);
      if (!response.success) {
        if (response.errors) throw new ValidationError(response.message, response.errors);
        throw new Error(response.message);
      }
      return { id, message: response.message };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: holidayKeys.lists() });
      queryClient.invalidateQueries({ queryKey: holidayKeys.detail(data.id) });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteHoliday() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`${BASE_PATH}/${id}`);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: holidayKeys.lists() });
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

export function useBulkApproveHolidays() {
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
      queryClient.invalidateQueries({ queryKey: holidayKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useBulkUnapproveHolidays() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.post<{ unapproved_count: number }>(
        `${BASE_PATH}/bulk-unapprove`,
        { ids }
      );
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: holidayKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useBulkDestroyHolidays() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.post(`${BASE_PATH}/bulk-destroy`, { ids });
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: holidayKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

// ==============================================================================
// IMPORT & EXPORT
// ==============================================================================

export function useHolidaysImport() {
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
      queryClient.invalidateQueries({ queryKey: holidayKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useHolidaysExport() {
  const { api } = useApiClient();

  return useMutation({
    mutationFn: async (params: HolidayExportParams) => {
      if (params.method === 'download') {
        const blob = await api.postBlob(`${BASE_PATH}/export`, params);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `holidays-export-${Date.now()}.${params.format === 'pdf' ? 'pdf' : 'xlsx'}`;
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

export function useHolidaysTemplateDownload() {
  const { api } = useApiClient();

  return useMutation({
    mutationFn: async () => {
      const blob = await api.getBlob(`${BASE_PATH}/download`);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `holidays-sample.csv`;
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