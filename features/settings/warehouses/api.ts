'use client';

import { useApiClient } from '@/lib/api/api-client-client';
import { ValidationError } from '@/lib/api/api-errors';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type {
  Warehouse,
  WarehouseExportParams,
  WarehouseFormData,
  WarehouseListParams,
  WarehouseOption,
} from './types';

export const warehouseKeys = {
  all: ['warehouses'] as const,
  lists: () => [...warehouseKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...warehouseKeys.lists(), filters] as const,
  details: () => [...warehouseKeys.all, 'detail'] as const,
  detail: (id: number) => [...warehouseKeys.details(), id] as const,
  options: () => [...warehouseKeys.all, 'options'] as const,
  template: () => [...warehouseKeys.all, 'template'] as const,
};

const BASE_PATH = '/warehouses';

export function useWarehouses(params?: WarehouseListParams) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: warehouseKeys.list(params),
    queryFn: async () => {
      const response = await api.get<Warehouse[]>(BASE_PATH, { params });
      return response;
    },
    enabled: sessionStatus !== 'loading',
  });
  return {
    ...query,
    isSessionLoading: sessionStatus === 'loading',
  };
}

export function useOptionWarehouses() {
  const { api, sessionStatus } = useApiClient();
  return useQuery({
    queryKey: warehouseKeys.options(),
    queryFn: async () => {
      const response = await api.get<WarehouseOption[]>(`${BASE_PATH}/options`);
      return response.data ?? [];
    },
    enabled: sessionStatus !== 'loading',
  });
}

export function useWarehouse(id: number) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: warehouseKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<Warehouse>(`${BASE_PATH}/${id}`);
      return response.data ?? null;
    },
    enabled: !!id && sessionStatus !== 'loading',
  });
  return {
    ...query,
    isSessionLoading: sessionStatus === 'loading',
  };
}

export function useCreateWarehouse() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: WarehouseFormData) => {
      const payload: Record<string, unknown> = {
        name: data.name,
        is_active: data.is_active ?? true,
      };
      if (data.phone != null) payload.phone = data.phone;
      if (data.email != null) payload.email = data.email;
      if (data.address != null) payload.address = data.address;

      const response = await api.post<{ data: Warehouse }>(BASE_PATH, payload);
      if (!response.success) {
        if (response.errors) throw new ValidationError(response.message, response.errors);
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: warehouseKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateWarehouse() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<WarehouseFormData> }) => {
      const payload: Record<string, unknown> = {};
      if (data.name !== undefined) payload.name = data.name;
      if (data.phone !== undefined) payload.phone = data.phone;
      if (data.email !== undefined) payload.email = data.email;
      if (data.address !== undefined) payload.address = data.address;
      if (data.is_active !== undefined) payload.is_active = data.is_active;

      const response = await api.put<{ data: Warehouse }>(`${BASE_PATH}/${id}`, payload);
      if (!response.success) {
        if (response.errors) throw new ValidationError(response.message, response.errors);
        throw new Error(response.message);
      }
      return { id, message: response.message };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: warehouseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: warehouseKeys.detail(data.id) });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteWarehouse() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`${BASE_PATH}/${id}`);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: warehouseKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useBulkActivateWarehouses() {
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
      queryClient.invalidateQueries({ queryKey: warehouseKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useBulkDeactivateWarehouses() {
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
      queryClient.invalidateQueries({ queryKey: warehouseKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useBulkDestroyWarehouses() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.post(`${BASE_PATH}/bulk-destroy`, { ids });
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: warehouseKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useWarehousesImport() {
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
      queryClient.invalidateQueries({ queryKey: warehouseKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useWarehousesExport() {
  const { api } = useApiClient();

  return useMutation({
    mutationFn: async (params: WarehouseExportParams) => {
      if (params.method === 'download') {
        const blob = await api.postBlob(`${BASE_PATH}/export`, params);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const fileName = `warehouses-export-${Date.now()}.${params.format === 'pdf' ? 'pdf' : 'xlsx'}`;
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

export function useWarehousesTemplateDownload() {
  const { api } = useApiClient();
  return useMutation({
    mutationFn: async () => {
      const blob = await api.getBlob(`${BASE_PATH}/download`);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `warehouses-sample.csv`;
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