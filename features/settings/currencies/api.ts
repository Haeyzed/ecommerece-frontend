'use client';

import { useApiClient } from '@/lib/api/api-client-client';
import { ValidationError } from '@/lib/api/api-errors';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type {
  Currency,
  CurrencyFormData,
  CurrencyListParams,
  CurrencyOption,
  CurrencyExportParams
} from './types';

export const currencyKeys = {
  all: ['currencies'] as const,
  lists: () => [...currencyKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...currencyKeys.lists(), filters] as const,
  details: () => [...currencyKeys.all, 'detail'] as const,
  detail: (id: number) => [...currencyKeys.details(), id] as const,
  options: () => [...currencyKeys.all, 'options'] as const,
};

const BASE_PATH = '/currencies';

export function useCurrencies(params?: CurrencyListParams) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: currencyKeys.list(params),
    queryFn: async () => {
      const response = await api.get<Currency[]>(BASE_PATH, { params });
      return response;
    },
    enabled: sessionStatus !== 'loading',
  });
  return {
    ...query,
    isSessionLoading: sessionStatus === 'loading',
  };
}

export function useOptionCurrencies() {
  const { api, sessionStatus } = useApiClient();
  return useQuery({
    queryKey: currencyKeys.options(),
    queryFn: async () => {
      const response = await api.get<CurrencyOption[]>(`${BASE_PATH}/options`);
      return response.data ?? [];
    },
    enabled: sessionStatus !== 'loading',
  });
}

export function useCurrency(id: number) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: currencyKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<Currency>(`${BASE_PATH}/${id}`);
      return response.data ?? null;
    },
    enabled: !!id && sessionStatus !== 'loading',
  });
  return {
    ...query,
    isSessionLoading: sessionStatus === 'loading',
  };
}

export function useCreateCurrency() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CurrencyFormData) => {
      const payload: Record<string, unknown> = {
        name: data.name,
        code: data.code,
        symbol: data.symbol,
        country_id: data.country_id,
      };

      if (data.precision !== undefined) payload.precision = data.precision;
      if (data.symbol_native !== undefined) payload.symbol_native = data.symbol_native;
      if (data.symbol_first !== undefined) payload.symbol_first = data.symbol_first;
      if (data.decimal_mark !== undefined) payload.decimal_mark = data.decimal_mark;
      if (data.thousands_separator !== undefined) payload.thousands_separator = data.thousands_separator;

      const response = await api.post<{ data: Currency }>(BASE_PATH, payload);
      if (!response.success) {
        if (response.errors) throw new ValidationError(response.message, response.errors);
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: currencyKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateCurrency() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CurrencyFormData> }) => {
      const payload: Record<string, unknown> = {};

      Object.keys(data).forEach((key) => {
        const value = data[key as keyof CurrencyFormData];
        if (value !== undefined) {
          payload[key] = value;
        }
      });

      const response = await api.put<{ data: Currency }>(`${BASE_PATH}/${id}`, payload);
      if (!response.success) {
        if (response.errors) throw new ValidationError(response.message, response.errors);
        throw new Error(response.message);
      }
      return { id, message: response.message };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: currencyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: currencyKeys.detail(data.id) });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteCurrency() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`${BASE_PATH}/${id}`);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: currencyKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useBulkDestroyCurrencies() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.post(`${BASE_PATH}/bulk-destroy`, { ids });
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: currencyKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useCurrenciesImport() {
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
      queryClient.invalidateQueries({ queryKey: currencyKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useCurrenciesExport() {
  const { api } = useApiClient();

  return useMutation({
    mutationFn: async (params: CurrencyExportParams) => {
      if (params.method === 'download') {
        const blob = await api.postBlob(`${BASE_PATH}/export`, params);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const fileName = `currencies-export-${Date.now()}.${params.format === 'pdf' ? 'pdf' : 'xlsx'}`;
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

export function useCurrenciesTemplateDownload() {
  const { api } = useApiClient();
  return useMutation({
    mutationFn: async () => {
      const blob = await api.getBlob(`${BASE_PATH}/download`);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `currencies-sample.csv`;
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