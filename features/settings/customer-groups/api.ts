'use client';

import { useApiClient } from '@/lib/api/api-client-client';
import { ValidationError } from '@/lib/api/api-errors';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { CustomerGroupFormData } from './schemas';
import type {
  CustomerGroup,
  CustomerGroupExportParams,
  CustomerGroupListParams,
  CustomerGroupOption,
} from './types';

export const customerGroupKeys = {
  all: ['customer-groups'] as const,
  lists: () => [...customerGroupKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...customerGroupKeys.lists(), filters] as const,
  details: () => [...customerGroupKeys.all, 'detail'] as const,
  detail: (id: number) => [...customerGroupKeys.details(), id] as const,
  options: () => [...customerGroupKeys.all, 'options'] as const,
  template: () => [...customerGroupKeys.all, 'template'] as const,
};

const BASE_PATH = '/customer-groups';

export function useCustomerGroups(params?: CustomerGroupListParams) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: customerGroupKeys.list(params),
    queryFn: async () => {
      const response = await api.get<CustomerGroup[]>(BASE_PATH, { params });
      return response;
    },
    enabled: sessionStatus !== 'loading',
  });
  return {
    ...query,
    isSessionLoading: sessionStatus === 'loading',
  };
}

export function useOptionCustomerGroups() {
  const { api, sessionStatus } = useApiClient();
  return useQuery({
    queryKey: customerGroupKeys.options(),
    queryFn: async () => {
      const response = await api.get<CustomerGroupOption[]>(
        `${BASE_PATH}/options`
      );
      return response.data ?? [];
    },
    enabled: sessionStatus !== 'loading',
  });
}

export function useCustomerGroup(id: number) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: customerGroupKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<CustomerGroup>(`${BASE_PATH}/${id}`);
      return response.data ?? null;
    },
    enabled: !!id && sessionStatus !== 'loading',
  });
  return {
    ...query,
    isSessionLoading: sessionStatus === 'loading',
  };
}

export function useCreateCustomerGroup() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CustomerGroupFormData) => {
      const payload: Record<string, unknown> = {
        name: data.name,
        percentage: data.percentage ?? 0,
        is_active: data.is_active ?? true,
      };

      const response = await api.post<{ data: CustomerGroup }>(BASE_PATH, payload);
      if (!response.success) {
        if (response.errors) throw new ValidationError(response.message, response.errors);
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: customerGroupKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateCustomerGroup() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CustomerGroupFormData> }) => {
      const payload: Record<string, unknown> = {};
      if (data.name !== undefined) payload.name = data.name;
      if (data.percentage !== undefined) payload.percentage = data.percentage;
      if (data.is_active !== undefined) payload.is_active = data.is_active;

      const response = await api.put<{ data: CustomerGroup }>(`${BASE_PATH}/${id}`, payload);
      if (!response.success) {
        if (response.errors) throw new ValidationError(response.message, response.errors);
        throw new Error(response.message);
      }
      return { id, message: response.message };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: customerGroupKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerGroupKeys.detail(data.id) });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteCustomerGroup() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`${BASE_PATH}/${id}`);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: customerGroupKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useBulkActivateCustomerGroups() {
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
      queryClient.invalidateQueries({ queryKey: customerGroupKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useBulkDeactivateCustomerGroups() {
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
      queryClient.invalidateQueries({ queryKey: customerGroupKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useBulkDestroyCustomerGroups() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.post(`${BASE_PATH}/bulk-destroy`, { ids });
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: customerGroupKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useCustomerGroupsImport() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.append("file", file);
      const response = await api.post(`${BASE_PATH}/import`, form);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: customerGroupKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useCustomerGroupsExport() {
  const { api } = useApiClient();

  return useMutation({
    mutationFn: async (params: CustomerGroupExportParams) => {
      if (params.method === "download") {
        const blob = await api.postBlob(`${BASE_PATH}/export`, params);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const fileName = `customer-groups-export-${Date.now()}.${params.format === "pdf" ? "pdf" : "xlsx"}`;
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

export function useCustomerGroupsTemplateDownload() {
  const { api } = useApiClient();
  return useMutation({
    mutationFn: async () => {
      const blob = await api.getBlob(`${BASE_PATH}/download`);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "customer-groups-sample.csv";
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
