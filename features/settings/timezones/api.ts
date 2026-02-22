'use client';

import { useApiClient } from '@/lib/api/api-client-client';
import { ValidationError } from '@/lib/api/api-errors';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type {
  Timezone,
  TimezoneFormData,
  TimezoneListParams,
  TimezoneOptionsGrouped,
  TimezoneExportParams
} from './types';

export const timezoneKeys = {
  all: ['timezones'] as const,
  lists: () => [...timezoneKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...timezoneKeys.lists(), filters] as const,
  details: () => [...timezoneKeys.all, 'detail'] as const,
  detail: (id: number) => [...timezoneKeys.details(), id] as const,
  options: () => [...timezoneKeys.all, 'options'] as const,
};

const BASE_PATH = '/timezones';

export function useTimezones(params?: TimezoneListParams) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: timezoneKeys.list(params),
    queryFn: async () => {
      const response = await api.get<Timezone[]>(BASE_PATH, { params });
      return response;
    },
    enabled: sessionStatus !== 'loading',
  });
  return {
    ...query,
    isSessionLoading: sessionStatus === 'loading',
  };
}

export function useOptionTimezones() {
  const { api, sessionStatus } = useApiClient();
  return useQuery({
    queryKey: timezoneKeys.options(),
    queryFn: async () => {
      const response = await api.get<TimezoneOptionsGrouped[]>(`${BASE_PATH}/options`);
      return response.data ?? [];
    },
    enabled: sessionStatus !== 'loading',
  });
}

export function useTimezone(id: number) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: timezoneKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<Timezone>(`${BASE_PATH}/${id}`);
      return response.data ?? null;
    },
    enabled: !!id && sessionStatus !== 'loading',
  });
  return {
    ...query,
    isSessionLoading: sessionStatus === 'loading',
  };
}

export function useCreateTimezone() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TimezoneFormData) => {
      const payload: Record<string, unknown> = {
        name: data.name,
        country_id: data.country_id,
      };

      const response = await api.post<{ data: Timezone }>(BASE_PATH, payload);
      if (!response.success) {
        if (response.errors) throw new ValidationError(response.message, response.errors);
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: timezoneKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateTimezone() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<TimezoneFormData> }) => {
      const payload: Record<string, unknown> = {};

      Object.keys(data).forEach((key) => {
        const value = data[key as keyof TimezoneFormData];
        if (value !== undefined) {
          payload[key] = value;
        }
      });

      const response = await api.put<{ data: Timezone }>(`${BASE_PATH}/${id}`, payload);
      if (!response.success) {
        if (response.errors) throw new ValidationError(response.message, response.errors);
        throw new Error(response.message);
      }
      return { id, message: response.message };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: timezoneKeys.lists() });
      queryClient.invalidateQueries({ queryKey: timezoneKeys.detail(data.id) });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteTimezone() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`${BASE_PATH}/${id}`);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: timezoneKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useBulkDestroyTimezones() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.post(`${BASE_PATH}/bulk-destroy`, { ids });
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: timezoneKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useTimezonesImport() {
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
      queryClient.invalidateQueries({ queryKey: timezoneKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useTimezonesExport() {
  const { api } = useApiClient();

  return useMutation({
    mutationFn: async (params: TimezoneExportParams) => {
      if (params.method === 'download') {
        const blob = await api.postBlob(`${BASE_PATH}/export`, params);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const fileName = `timezones-export-${Date.now()}.${params.format === 'pdf' ? 'pdf' : 'xlsx'}`;
        link.download = fileName;
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

export function useTimezonesTemplateDownload() {
  const { api } = useApiClient();
  return useMutation({
    mutationFn: async () => {
      const blob = await api.getBlob(`${BASE_PATH}/download`);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `timezones-sample.csv`;
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