'use client';

import { useApiClient } from '@/lib/api/api-client-client';
import { ValidationError } from '@/lib/api/api-errors';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type {
  Brand,
  BrandExportParams,
  BrandFormData,
  BrandListParams,
  BrandOption,
} from './types';

export const brandKeys = {
  all: ['brands'] as const,
  lists: () => [...brandKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...brandKeys.lists(), filters] as const,
  details: () => [...brandKeys.all, 'detail'] as const,
  detail: (id: number) => [...brandKeys.details(), id] as const,
  options: () => [...brandKeys.all, 'options'] as const,
  template: () => [...brandKeys.all, 'template'] as const,
};

const BASE_PATH = '/brands';

export function useBrands(params?: BrandListParams) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: brandKeys.list(params),
    queryFn: async () => {
      const response = await api.get<Brand[]>(
        BASE_PATH,
        { params }
      );
      return response;
    },
    enabled: sessionStatus !== 'loading',
  });
  return {
    ...query,
    isSessionLoading: sessionStatus === 'loading',
  };
}

export function useOptionBrands() {
  const { api, sessionStatus } = useApiClient();
  return useQuery({
    queryKey: brandKeys.options(),
    queryFn: async () => {
      const response = await api.get<BrandOption[]>(`${BASE_PATH}/options`);
      return response.data ?? [];
    },
    enabled: sessionStatus !== 'loading',
  });
}

export function useBrand(id: number) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: brandKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<Brand>(`${BASE_PATH}/${id}`);
      return response.data ?? null;
    },
    enabled: !!id && sessionStatus !== 'loading',
  });
  return {
    ...query,
    isSessionLoading: sessionStatus === 'loading',
  };
}

export function useCreateBrand() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: BrandFormData) => {
      const formData = new FormData();

      formData.append("name", data.name);
      if (data.slug) formData.append("slug", data.slug);
      if (data.short_description) formData.append("short_description", data.short_description);
      if (data.page_title) formData.append("page_title", data.page_title);
      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }
      if (data.is_active !== undefined) formData.append("is_active", data.is_active ? "1" : "0");

      const response = await api.post<{ data: Brand }>(BASE_PATH, formData);
      if (!response.success) {
        if (response.errors) {
          throw new ValidationError(response.message, response.errors);
        }
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateBrand() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<BrandFormData> }) => {
      const formData = new FormData();
      formData.append("_method", "PUT");
      if (data.name) formData.append("name", data.name);
      if (data.slug !== undefined) formData.append("slug", data.slug || "");
      if (data.short_description !== undefined) formData.append("short_description", data.short_description || "");
      if (data.page_title !== undefined) formData.append("page_title", data.page_title || "");
      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }
      if (data.is_active !== undefined) formData.append("is_active", data.is_active ? "1" : "0");

      const response = await api.post<{ data: Brand }>(`${BASE_PATH}/${id}`, formData);
      if (!response.success) {
        if (response.errors) {
          throw new ValidationError(response.message, response.errors);
        }
        throw new Error(response.message);
      }
      return { id, message: response.message };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
      queryClient.invalidateQueries({ queryKey: brandKeys.detail(data.id) });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteBrand() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`${BASE_PATH}/${id}`);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useBulkActivateBrands() {
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
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useBulkDeactivateBrands() {
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
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useBulkDestroyBrands() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.post(`${BASE_PATH}/bulk-destroy`, { ids });
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useBrandsImport() {
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
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useBrandsExport() {
  const { api } = useApiClient();

  return useMutation({
    mutationFn: async (params: BrandExportParams) => {
      if (params.method === "download") {
        const blob = await api.postBlob(`${BASE_PATH}/export`, params);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const fileName = `brands-export-${Date.now()}.${params.format === "pdf" ? "pdf" : "xlsx"}`;
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

export function useBrandsTemplateDownload() {
  const { api } = useApiClient();
  return useMutation({
    mutationFn: async () => {
      const blob = await api.getBlob(`${BASE_PATH}/download`);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `brands-sample.csv`;
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