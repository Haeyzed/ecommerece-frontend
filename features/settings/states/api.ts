'use client';

import { useApiClient } from '@/lib/api/api-client-client';
import { ValidationError } from '@/lib/api/api-errors';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  State,
  StateFormData,
  StateListParams,
  StateOption,
  StateExportParams, CityOption,
} from './types'

export const stateKeys = {
  all: ['states'] as const,
  lists: () => [...stateKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...stateKeys.lists(), filters] as const,
  details: () => [...stateKeys.all, 'detail'] as const,
  detail: (id: number) => [...stateKeys.details(), id] as const,
  options: () => [...stateKeys.all, 'options'] as const,
  cities: (stateId: number) => [...stateKeys.all, 'cities', stateId] as const,
};

const BASE_PATH = '/states';

export function useStates(params?: StateListParams) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: stateKeys.list(params),
    queryFn: async () => {
      const response = await api.get<State[]>(BASE_PATH, { params });
      return response;
    },
    enabled: sessionStatus !== 'loading',
  });
  return {
    ...query,
    isSessionLoading: sessionStatus === 'loading',
  };
}

export function useOptionStates() {
  const { api, sessionStatus } = useApiClient();
  return useQuery({
    queryKey: stateKeys.options(),
    queryFn: async () => {
      const response = await api.get<StateOption[]>(`${BASE_PATH}/options`);
      return response.data ?? [];
    },
    enabled: sessionStatus !== 'loading',
  });
}

export function useStateDetail(id: number) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: stateKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<State>(`${BASE_PATH}/${id}`);
      return response.data ?? null;
    },
    enabled: !!id && sessionStatus !== 'loading',
  });
  return {
    ...query,
    isSessionLoading: sessionStatus === 'loading',
  };
}

export function useCitiesByState(stateId: number | null) {
  const { api, sessionStatus } = useApiClient();
  return useQuery({
    queryKey: stateKeys.cities(stateId ?? 0),
    queryFn: async () => {
      const response = await api.get<CityOption[]>(
        `${BASE_PATH}/${stateId}/cities`
      );
      return response.data ?? [];
    },
    enabled: !!stateId && sessionStatus !== 'loading',
  });
}

export function useCreateState() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: StateFormData) => {
      const payload: Record<string, unknown> = {
        name: data.name,
        country_id: data.country_id,
      };

      if (data.code !== undefined) payload.code = data.code;
      if (data.country_code !== undefined) payload.country_code = data.country_code;
      if (data.state_code !== undefined) payload.state_code = data.state_code;
      if (data.type !== undefined) payload.type = data.type;
      if (data.latitude !== undefined) payload.latitude = data.latitude;
      if (data.longitude !== undefined) payload.longitude = data.longitude;

      const response = await api.post<{ data: State }>(BASE_PATH, payload);
      if (!response.success) {
        if (response.errors) throw new ValidationError(response.message, response.errors);
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: stateKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateState() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<StateFormData> }) => {
      const payload: Record<string, unknown> = {};

      Object.keys(data).forEach((key) => {
        const value = data[key as keyof StateFormData];
        if (value !== undefined) {
          payload[key] = value;
        }
      });

      const response = await api.put<{ data: State }>(`${BASE_PATH}/${id}`, payload);
      if (!response.success) {
        if (response.errors) throw new ValidationError(response.message, response.errors);
        throw new Error(response.message);
      }
      return { id, message: response.message };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: stateKeys.lists() });
      queryClient.invalidateQueries({ queryKey: stateKeys.detail(data.id) });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteState() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`${BASE_PATH}/${id}`);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: stateKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useBulkDestroyStates() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.post(`${BASE_PATH}/bulk-destroy`, { ids });
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: stateKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useStatesImport() {
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
      queryClient.invalidateQueries({ queryKey: stateKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useStatesExport() {
  const { api } = useApiClient();

  return useMutation({
    mutationFn: async (params: StateExportParams) => {
      if (params.method === 'download') {
        const blob = await api.postBlob(`${BASE_PATH}/export`, params);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const fileName = `states-export-${Date.now()}.${params.format === 'pdf' ? 'pdf' : 'xlsx'}`;
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

export function useStatesTemplateDownload() {
  const { api } = useApiClient();
  return useMutation({
    mutationFn: async () => {
      const blob = await api.getBlob(`${BASE_PATH}/download`);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `states-sample.csv`;
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