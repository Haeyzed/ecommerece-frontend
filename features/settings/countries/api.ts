'use client';

import { useApiClient } from '@/lib/api/api-client-client';
import { ValidationError } from '@/lib/api/api-errors';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type {
  Country,
  CountryExportParams,
  CountryFormData,
  CountryListParams,
  CountryOption,
} from './types';

export const countryKeys = {
  all: ['countries'] as const,
  lists: () => [...countryKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...countryKeys.lists(), filters] as const,
  details: () => [...countryKeys.all, 'detail'] as const,
  detail: (id: number) => [...countryKeys.details(), id] as const,
  options: () => [...countryKeys.all, 'options'] as const,
  states: (countryId: number) => [...countryKeys.all, 'states', countryId] as const,
  template: () => [...countryKeys.all, 'template'] as const,
};

const BASE_PATH = '/countries';

export function useCountries(params?: CountryListParams) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: countryKeys.list(params),
    queryFn: async () => {
      const response = await api.get<Country[]>(BASE_PATH, { params });
      return response;
    },
    enabled: sessionStatus !== 'loading',
  });
  return {
    ...query,
    isSessionLoading: sessionStatus === 'loading',
  };
}

export function useOptionCountries() {
  const { api, sessionStatus } = useApiClient();
  return useQuery({
    queryKey: countryKeys.options(),
    queryFn: async () => {
      const response = await api.get<CountryOption[]>(`${BASE_PATH}/options`);
      return response.data ?? [];
    },
    enabled: sessionStatus !== 'loading',
  });
}

export function useCountry(id: number) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: countryKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<Country>(`${BASE_PATH}/${id}`);
      return response.data ?? null;
    },
    enabled: !!id && sessionStatus !== 'loading',
  });
  return {
    ...query,
    isSessionLoading: sessionStatus === 'loading',
  };
}

export function useStatesByCountry(countryId: number | null) {
  const { api, sessionStatus } = useApiClient();
  return useQuery({
    queryKey: countryKeys.states(countryId ?? 0),
    queryFn: async () => {
      const response = await api.get<{ value: number; label: string }[]>(
        `${BASE_PATH}/${countryId}/states`
      );
      return response.data ?? [];
    },
    enabled: !!countryId && sessionStatus !== 'loading',
  });
}

export function useCreateCountry() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CountryFormData) => {
      const payload: Record<string, unknown> = {
        iso2: data.iso2,
        name: data.name,
        status: data.status ?? true,
      };

      // Map optional fields
      if (data.phone_code !== undefined) payload.phone_code = data.phone_code;
      if (data.iso3 !== undefined) payload.iso3 = data.iso3;
      if (data.region !== undefined) payload.region = data.region;
      if (data.subregion !== undefined) payload.subregion = data.subregion;
      if (data.native !== undefined) payload.native = data.native;
      if (data.latitude !== undefined) payload.latitude = data.latitude;
      if (data.longitude !== undefined) payload.longitude = data.longitude;
      if (data.emoji !== undefined) payload.emoji = data.emoji;
      if (data.emojiU !== undefined) payload.emojiU = data.emojiU;

      const response = await api.post<{ data: Country }>(BASE_PATH, payload);
      if (!response.success) {
        if (response.errors) throw new ValidationError(response.message, response.errors);
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: countryKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateCountry() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CountryFormData> }) => {
      const payload: Record<string, unknown> = {};

      Object.keys(data).forEach((key) => {
        const value = data[key as keyof CountryFormData];
        if (value !== undefined) {
          payload[key] = value;
        }
      });

      const response = await api.put<{ data: Country }>(`${BASE_PATH}/${id}`, payload);
      if (!response.success) {
        if (response.errors) throw new ValidationError(response.message, response.errors);
        throw new Error(response.message);
      }
      return { id, message: response.message };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: countryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: countryKeys.detail(data.id) });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteCountry() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`${BASE_PATH}/${id}`);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: countryKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useBulkActivateCountries() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.patch<{ activated_count: number }>(
        `${BASE_PATH}/bulk-activate`,
        { ids }
      );
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: countryKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useBulkDeactivateCountries() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.patch<{ deactivated_count: number }>(
        `${BASE_PATH}/bulk-deactivate`,
        { ids }
      );
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: countryKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useBulkDestroyCountries() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.post(`${BASE_PATH}/bulk-destroy`, { ids });
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: countryKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useCountriesImport() {
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
      queryClient.invalidateQueries({ queryKey: countryKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useCountriesExport() {
  const { api } = useApiClient();

  return useMutation({
    mutationFn: async (params: CountryExportParams) => {
      if (params.method === 'download') {
        const blob = await api.postBlob(`${BASE_PATH}/export`, params);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const fileName = `countries-export-${Date.now()}.${params.format === 'pdf' ? 'pdf' : 'xlsx'}`;
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

export function useCountriesTemplateDownload() {
  const { api } = useApiClient();
  return useMutation({
    mutationFn: async () => {
      const blob = await api.getBlob(`${BASE_PATH}/download`);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `countries-sample.csv`;
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